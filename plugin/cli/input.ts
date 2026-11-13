import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'

import type { Schema } from './api.ts'
import { usage } from './errors.ts'

// A tool's input from the command line and from files. Values are typed by the tool's own schema,
// so `limit=50` is a number, `again=true` a boolean, and a field that takes a list takes the same
// name again (`titles=CFO titles="Chief Financial Officer"`). `field:=<json>` is JSON as it is;
// `field=@path` reads the value from a file (a list: one item a line), `field:=@path` a JSON file.

export async function readText(path: string) {
  if (path === '-') {
    const chunks: Buffer[] = []
    for await (const chunk of process.stdin) chunks.push(chunk as Buffer)
    return Buffer.concat(chunks).toString('utf8')
  }
  try {
    return await readFile(path, 'utf8')
  } catch (error) {
    throw usage(`Cannot read ${path}: ${(error as NodeJS.ErrnoException).code ?? error}`)
  }
}

export function parseJson(text: string, where: string): unknown {
  try {
    return JSON.parse(text)
  } catch (error) {
    throw usage(`${where} is not JSON: ${(error as Error).message}`)
  }
}

const typesOf = (s: Schema | undefined): string[] => {
  if (!s) return []
  const own = Array.isArray(s.type) ? s.type : s.type ? [s.type] : []
  return [...own, ...(s.anyOf ?? []).flatMap(typesOf)]
}

const arrayItems = (s: Schema | undefined): Schema | undefined =>
  s?.items ?? s?.anyOf?.find((a) => a.items)?.items

/** One text value as the schema wants it; a value that cannot be is left as text for Dylan to refuse. */
export function coerce(value: string, s: Schema | undefined): unknown {
  const types = typesOf(s)
  const v = value.trim()
  if ((types.includes('object') || types.includes('array')) && /^[[{]/.test(v))
    return parseJson(v, `"${v.slice(0, 40)}"`)
  if (types.includes('integer') || types.includes('number')) {
    const n = Number(v)
    if (v !== '' && Number.isFinite(n)) return n
  }
  if (types.includes('boolean')) {
    if (/^(true|yes|1)$/i.test(v)) return true
    if (/^(false|no|0)$/i.test(v)) return false
  }
  if (types.includes('null') && v === '') return null
  return value
}

function setPath(target: Record<string, unknown>, path: string[], value: unknown) {
  let node = target
  for (const key of path.slice(0, -1)) {
    const next = node[key]
    if (!next || typeof next !== 'object' || Array.isArray(next)) node[key] = {}
    node = node[key] as Record<string, unknown>
  }
  node[path.at(-1)!] = value
}

const schemaAt = (s: Schema | undefined, path: string[]) =>
  path.reduce<Schema | undefined>(
    (node, key) =>
      node?.properties?.[key] ?? node?.anyOf?.find((a) => a.properties?.[key])?.properties?.[key],
    s,
  )

/** `name=value`, `name:=json` and their `@file` forms, typed by the schema; a.b sets a nested field. */
export async function assignments(args: string[], schema: Schema) {
  const input: Record<string, unknown> = {}
  for (const arg of args) {
    const m = /^([A-Za-z_][\w.]*)(:?=)([\s\S]*)$/.exec(arg)
    if (!m)
      throw usage(
        `Cannot read "${arg}"`,
        'Give fields as name=value, name:=<json>, name=@file or name:=@file',
      )
    const [, name, op, raw] = m as unknown as [string, string, string, string]
    const path = name.split('.')
    const s = schemaAt(schema, path)
    let value: unknown
    if (op === ':=')
      value = raw.startsWith('@')
        ? parseJson(await readText(raw.slice(1)), raw.slice(1))
        : parseJson(raw, name)
    else if (raw.startsWith('@') && raw.length > 1) {
      const text = await readText(raw.slice(1))
      value = typesOf(s).includes('array')
        ? text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => coerce(line, arrayItems(s)))
        : text
    } else if (typesOf(s).includes('array') && !/^\s*\[/.test(raw)) {
      // A list field given again adds to it.
      const was = path.reduce<unknown>(
        (node, key) => (node as Record<string, unknown>)?.[key],
        input,
      )
      value = [...(Array.isArray(was) ? was : []), coerce(raw, arrayItems(s))]
    } else value = coerce(raw, s)
    setPath(input, path, value)
  }
  return input
}

/** CSV or TSV rows as lists of cells: quoted cells with "" for a quote, CRLF or LF. */
export function parseCsv(text: string): string[][] {
  const firstLine = text.split('\n', 1)[0] ?? ''
  const count = (ch: string) => firstLine.split(ch).length - 1
  const sep = count('\t') > 0 ? '\t' : count(';') > count(',') ? ';' : ','
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"' && cell === '') quoted = true
    else if (ch === sep) {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += ch
  }
  if (cell || row.length) rows.push([...row, cell])
  return rows.filter((r) => r.some((c) => c.trim()))
}

/**
 * A CSV's rows as objects of the item schema: a header names the field (a.b a nested one), a cell
 * is typed by it, a list cell splits on ; or |, an empty cell is left out. A column the item does
 * not have goes into its `facts` when it has them; otherwise it is named in `dropped`.
 */
export function rowsFromCsv(text: string, item: Schema | undefined) {
  const [header, ...rest] = parseCsv(text.replace(/^﻿/, ''))
  if (!header) return { rows: [], dropped: [] as string[] }
  const names = header.map((h) => h.trim())
  const known = item?.properties ?? {}
  const facts = 'facts' in known
  const dropped = names.filter((n) => !(n.split('.')[0]! in known) && !facts)
  const rows = rest.map((cells) => {
    const row: Record<string, unknown> = {}
    names.forEach((name, i) => {
      const cell = cells[i]
      if (cell === undefined || cell.trim() === '') return
      const path = name.split('.')
      if (!(path[0]! in known)) {
        if (facts) setPath(row, ['facts', ...path], cell.trim())
        return
      }
      const s = schemaAt(item, path)
      const value =
        typesOf(s).includes('array') && !/^\s*\[/.test(cell)
          ? cell
              .split(/[;|]/)
              .map((part) => part.trim())
              .filter(Boolean)
              .map((part) => coerce(part, arrayItems(s)))
          : coerce(cell, s)
      setPath(row, path, value)
    })
    return row
  })
  return { rows, dropped }
}

/** The rows of a file: a CSV or TSV with a header, JSON Lines, or JSON (a list, or an object holding one). */
export async function rowsFromFile(path: string, item: Schema | undefined) {
  const text = await readText(path)
  const ext = extname(path).toLowerCase()
  if (ext === '.csv' || ext === '.tsv') return rowsFromCsv(text, item)
  if (ext === '.jsonl' || ext === '.ndjson')
    return {
      rows: text
        .split(/\r?\n/)
        .filter((line) => line.trim())
        .map((line, i) => parseJson(line, `${path} line ${i + 1}`)),
      dropped: [],
    }
  const parsed = parseJson(text, path)
  const rows = Array.isArray(parsed) ? parsed : listIn(parsed)
  if (!rows)
    throw usage(
      `${path} holds no list of rows`,
      'Give a JSON list, JSON Lines, or a CSV with a header',
    )
  return { rows, dropped: [] as string[] }
}

/** The list an answer carries: the answer itself, its `items`, or its only list. */
export function listIn(answer: unknown): unknown[] | null {
  if (Array.isArray(answer)) return answer
  if (!answer || typeof answer !== 'object') return null
  const o = answer as Record<string, unknown>
  if (Array.isArray(o['items'])) return o['items']
  const lists = Object.values(o).filter(Array.isArray)
  return lists.length === 1 ? (lists[0] as unknown[]) : null
}
