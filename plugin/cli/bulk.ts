import { callTool, type Tool } from './api.ts'
import { DylanError, usage } from './errors.ts'
import { listIn } from './input.ts'

// Work too large for one call, done as several without passing through the agent's context: a
// file of rows sent in batches the tool takes (--each), and every page of a list read into one
// file (--all).

/** A request body Dylan takes comfortably: a thousand companies with long facts are megabytes. */
export const BATCH_BYTES = 512 * 1024
/** Never more pages than this in one --all: a list that long is a question to narrow. */
export const MAX_PAGES = 500

/** Rows in batches of at most `maxRows` and about `maxBytes` of JSON; a larger row goes alone. */
export function chunk<T>(rows: T[], maxRows: number, maxBytes = BATCH_BYTES): T[][] {
  const chunks: T[][] = []
  let current: T[] = []
  let bytes = 2
  for (const row of rows) {
    const size = Buffer.byteLength(JSON.stringify(row)) + 1
    if (current.length && (current.length >= maxRows || bytes + size > maxBytes)) {
      chunks.push(current)
      current = []
      bytes = 2
    }
    current.push(row)
    bytes += size
  }
  if (current.length) chunks.push(current)
  return chunks
}

/** The batches' answers as one: lists join; in objects, counts add up and lists join. */
export function merge(answers: unknown[]): unknown {
  if (answers.length === 1) return answers[0]
  if (answers.every(Array.isArray)) return answers.flat()
  return answers.reduce<Record<string, unknown>>((merged, answer) => {
    if (!answer || typeof answer !== 'object') return merged
    for (const [key, value] of Object.entries(answer as Record<string, unknown>)) {
      const was = merged[key]
      merged[key] =
        typeof value === 'number' && typeof was === 'number'
          ? was + value
          : Array.isArray(value) && Array.isArray(was)
            ? [...was, ...value]
            : value
    }
    return merged
  }, {})
}

const n = (x: number) => x.toLocaleString('en-US')

/**
 * Sends `rows` as the tool's `field`, in batches. The first refused batch stops it, and the
 * refusal says which rows went in before it; what came back so far is kept for the caller.
 */
export async function sendEach(
  server: string,
  tool: Tool,
  base: Record<string, unknown>,
  field: string,
  rows: unknown[],
  batch: number | undefined,
  progress: (line: string) => void,
) {
  const prop = tool.inputSchema.properties?.[field]
  if (!prop || !(prop.type === 'array' || prop.items))
    throw usage(
      `${tool.name} has no list field named ${field}`,
      `Its list fields: ${listFields(tool).join(', ') || 'none'}`,
    )
  if (rows.length === 0) throw usage('The file holds no rows')
  const most = prop.maxItems ?? 1000
  const size = Math.min(batch ?? most, most)
  const parts = chunk(rows, size)
  const answers: unknown[] = []
  let sent = 0
  for (const [i, part] of parts.entries()) {
    try {
      answers.push(await callTool(server, tool.name, { ...base, [field]: part }))
    } catch (error) {
      const e = error as DylanError
      const failed = new DylanError(
        `${e.message} (batch ${i + 1} of ${parts.length}: rows ${n(sent + 1)}–${n(sent + part.length)}; ${n(sent)} rows before it went in)`,
        e.hint,
        e.exitCode,
        e.code,
        e.details,
      )
      return { answer: merge(answers), error: failed, calls: i, rows: sent }
    }
    sent += part.length
    if (parts.length > 1)
      progress(`batch ${i + 1} of ${parts.length}: ${n(sent)} of ${n(rows.length)} rows`)
  }
  return { answer: merge(answers), error: null, calls: parts.length, rows: sent }
}

export const listFields = (tool: Tool) =>
  Object.entries(tool.inputSchema.properties ?? {})
    .filter(([, s]) => s.type === 'array' || s.items)
    .map(([k]) => k)

/** Whether a tool reads in pages, and how. */
export function pagingOf(tool: Tool): 'offset' | 'cursor' | null {
  const props = tool.inputSchema.properties ?? {}
  if ('cursor' in props) return 'cursor'
  if ('offset' in props && 'limit' in props) return 'offset'
  return null
}

/**
 * Every page of a list tool, as one list of rows. Only tools that read: a paid search is paged by
 * hand, each page asked for. An offset ends at a short page, a cursor when none comes back.
 */
export async function readAll(
  server: string,
  tool: Tool,
  input: Record<string, unknown>,
  progress: (line: string) => void,
) {
  if (!tool.annotations.readOnlyHint)
    throw usage(
      `--all reads every page of a tool that only reads; ${tool.name} does more`,
      'Page it by hand with offset or cursor, one page at a time',
    )
  const paging = pagingOf(tool)
  if (!paging) throw usage(`${tool.name} does not read in pages`, 'Run it without --all')
  const props = tool.inputSchema.properties ?? {}
  const limit = (input['limit'] as number | undefined) ?? props['limit']?.maximum ?? 100
  const rows: unknown[] = []
  let at: Record<string, unknown> = { ...input, ...('limit' in props ? { limit } : {}) }
  for (let page = 1; page <= MAX_PAGES; page++) {
    const answer = await callTool(server, tool.name, at)
    const got = listIn(answer)
    if (!got)
      throw new DylanError(
        `${tool.name} answered with no single list to page through`,
        'Run it without --all and page by hand',
      )
    rows.push(...got)
    if (page % 5 === 0) progress(`page ${page}: ${n(rows.length)} rows`)
    if (paging === 'cursor') {
      const next = (answer as Record<string, unknown>)['nextCursor']
      if (typeof next !== 'string' || !next || got.length === 0) return rows
      at = { ...at, cursor: next }
    } else {
      if (got.length < limit) return rows
      at = { ...at, offset: ((at['offset'] as number | undefined) ?? 0) + got.length }
    }
  }
  progress(`stopped after ${MAX_PAGES} pages; narrow the question to read the rest`)
  return rows
}

/** Each row with only the named fields (a.b reaches into one); anything else is left as it was. */
export function pick(value: unknown, fields: string[]): unknown {
  const one = (row: unknown) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) return row
    const out: Record<string, unknown> = {}
    for (const f of fields) {
      const v = f
        .split('.')
        .reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], row)
      if (v !== undefined) out[f] = v
    }
    return out
  }
  if (Array.isArray(value)) return value.map(one)
  const list = listIn(value)
  if (list && value && typeof value === 'object') {
    const o = value as Record<string, unknown>
    const key = Array.isArray(o['items']) ? 'items' : Object.keys(o).find((k) => o[k] === list)!
    return { ...o, [key]: list.map(one) }
  }
  return one(value)
}
