#!/usr/bin/env node
import { realpathSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { request, type Schema, type Tool, toolNamed, tools, VERSION, callTool } from './api.ts'
import { login, logout } from './auth.ts'
import { fetchAutopilot, formatAutopilot } from './autopilot.ts'
import { readAll, sendEach, pick } from './bulk.ts'
import { serverOf } from './config.ts'
import { DylanError, usage } from './errors.ts'
import { assignments, listIn, parseJson, readText, rowsFromFile } from './input.ts'

// dylan: Dylan's tools from a terminal, for an agent that works in one (Claude Code, Codex, a
// script). The same tools as Dylan's MCP server, with what a terminal adds: answers written to a
// file instead of the conversation, rows read from a file and sent in batches, every page of a
// list read at once.

const HELP = `dylan ${VERSION}: Dylan's tools from the command line

Usage:
  dylan login [--no-browser]     sign in in the browser; the organisation is picked there
  dylan logout                   sign out on this machine
  dylan whoami                   who is signed in, and into which organisation
  dylan autopilot [--project <slug>] [--json]
                                 read-only daily sweep snapshot for a project
  dylan tools [--json]           every tool: its name, whether it only reads, and its title
  dylan tool <name>              a tool's description and fields
  dylan call <tool> [name=value ...] [options]
                                 run a tool

Fields:
  name=value            typed by the tool's schema (numbers, true/false); a list field takes the
                        name again for each item: titles=CFO titles="Head of Finance"
  name:=<json>          JSON as it is: segments:='["…"]'  facts:='{"stack":"Shopify"}'
  name=@file            the value from a file (for a list, one item a line)
  name:=@file.json      JSON from a file
  a.b=value             a nested field

Options for call:
  --input <file|->      the input as JSON (fields given after it override it)
  --each <field> --from <file.csv|.tsv|.json|.jsonl>
                        send a file's rows as <field>, in batches the tool takes
  --batch <n>           rows per batch (at most the tool's own limit)
  --all                 read every page of a list tool into one list
  --pick <a,b,c>        keep only these fields of each row
  --out <file>          write the answer to a file (.json, or .jsonl one row a line) and print
                        one line about it instead
  --yes                 run a tool that launches, sends, buys or spends — only once the
                        person said yes; a dry run (dryRun=true) needs none

Anywhere:
  --server <url>        another Dylan (DYLAN_URL); Dylan's own by default
  DYLAN_API_KEY         a key made in Dylan's app, instead of dylan login

Exit codes: 0 done, 1 Dylan refused or a call failed, 2 the command was wrong.
`

type Flags = {
  server?: string
  project?: string
  input?: string
  each?: string
  from?: string
  batch?: number
  all: boolean
  pick?: string[]
  out?: string
  yes: boolean
  json: boolean
  browser: boolean
  help: boolean
  version: boolean
}

const VALUED = new Set(['server', 'project', 'input', 'each', 'from', 'batch', 'pick', 'out'])
const SWITCHES = new Set(['all', 'yes', 'json', 'no-browser', 'help', 'version'])

export function parseArgs(argv: string[]) {
  const flags: Flags = {
    all: false,
    yes: false,
    json: false,
    browser: true,
    help: false,
    version: false,
  }
  const rest: string[] = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!
    if (arg === '-h') {
      flags.help = true
      continue
    }
    if (!arg.startsWith('--')) {
      rest.push(arg)
      continue
    }
    const eq = arg.indexOf('=')
    const name = arg.slice(2, eq < 0 ? undefined : eq)
    if (SWITCHES.has(name) && eq < 0) {
      if (name === 'no-browser') flags.browser = false
      else (flags as Record<string, unknown>)[name] = true
      continue
    }
    if (!VALUED.has(name)) throw usage(`Unknown option --${name}`, 'dylan --help lists them')
    const value = eq < 0 ? argv[++i] : arg.slice(eq + 1)
    if (value === undefined) throw usage(`--${name} needs a value`)
    if (name === 'batch') {
      const b = Number(value)
      if (!Number.isInteger(b) || b < 1) throw usage('--batch takes a whole number above 0')
      flags.batch = b
    } else if (name === 'pick')
      flags.pick = value
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean)
    else (flags as Record<string, unknown>)[name] = value
  }
  return { flags, rest }
}

const out = (text: string) => process.stdout.write(text.endsWith('\n') ? text : `${text}\n`)
const note = (text: string) => process.stderr.write(`${text}\n`)
const n = (x: number) => x.toLocaleString('en-US')

const kindOf = (t: Tool) =>
  t.annotations.destructiveHint ? 'asks' : t.annotations.readOnlyHint ? 'reads' : 'writes'

const typeOf = (s: Schema): string => {
  if (s.enum) return s.enum.map(String).join('|')
  if (s.anyOf)
    return s.anyOf
      .map(typeOf)
      .filter((x) => x !== 'null')
      .join(' or ')
  const t = Array.isArray(s.type) ? s.type.join('|') : (s.type ?? 'any')
  return t === 'array' && s.items ? `list of ${typeOf(s.items)}` : t
}

function describeTool(t: Tool) {
  const lines = [`${t.name}: ${t.title} (${kindOf(t)})`, '', t.description, '']
  const props = t.inputSchema.properties ?? {}
  const required = new Set(t.inputSchema.required ?? [])
  if (Object.keys(props).length) {
    lines.push('Fields:')
    for (const [name, s] of Object.entries(props)) {
      const limit = s.maxItems ? `, up to ${n(s.maxItems)}` : ''
      lines.push(
        `  ${name}${required.has(name) ? '' : '?'}  ${typeOf(s)}${limit}${s.description ? `: ${s.description}` : ''}`,
      )
      const item = s.items?.properties
      if (item)
        for (const [k, v] of Object.entries(item))
          lines.push(`      ${k}  ${typeOf(v)}${v.description ? `: ${v.description}` : ''}`)
    }
  }
  if (t.annotations.destructiveHint)
    lines.push('', 'Asks the person first: run it with --yes only once they said yes.')
  return lines.join('\n')
}

/** Writes an answer to a file and says in one line what went there. */
async function writeAnswer(path: string, answer: unknown) {
  await mkdir(dirname(path), { recursive: true })
  const list = listIn(answer)
  if (extname(path).toLowerCase() === '.jsonl') {
    if (!list)
      throw usage(
        'The answer is not a list, so it cannot be JSON Lines',
        'Write it to a .json file',
      )
    await writeFile(
      path,
      list.map((row) => JSON.stringify(row)).join('\n') + (list.length ? '\n' : ''),
    )
  } else await writeFile(path, `${JSON.stringify(answer, null, 2)}\n`)
  const rows = Array.isArray(answer)
    ? answer
    : Array.isArray((answer as { items?: unknown } | null)?.items)
      ? (answer as { items: unknown[] }).items
      : null
  return rows ? `${n(rows.length)} rows` : 'the answer'
}

async function call(server: string, name: string, args: string[], flags: Flags) {
  const tool = await toolNamed(server, name)
  const base: Record<string, unknown> = {}
  if (flags.input) {
    const parsed = parseJson(await readText(flags.input), flags.input)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      throw usage(`${flags.input} is not a JSON object of fields`)
    Object.assign(base, parsed)
  }
  Object.assign(base, await assignments(args, tool.inputSchema))
  // A dry run changes nothing and answers what the call would do — what the person is shown
  // before their yes — so it needs none.
  if (tool.annotations.destructiveHint && !flags.yes && base['dryRun'] !== true)
    throw new DylanError(
      `${name} launches, sends, buys or spends, so it waits for the person's yes`,
      'Tell them what it will do and what it costs (dylan tool ' +
        name +
        ' gives the price), then run it again with --yes',
      2,
      'needs_yes',
    )

  let answer: unknown
  let summary = ''
  let failure: DylanError | null = null
  /** Whether anything came back to keep: a run refused at its first batch has nothing. */
  let kept = true
  if (flags.each || flags.from) {
    if (!flags.each || !flags.from) throw usage('--each and --from go together')
    if (flags.all) throw usage('--all reads pages; --each sends rows. Use one of them')
    const item = tool.inputSchema.properties?.[flags.each]?.items
    const { rows, dropped } = await rowsFromFile(flags.from, item)
    if (dropped.length)
      note(
        `left out: ${dropped.join(', ')} (not fields of ${flags.each}; dylan tool ${name} lists them)`,
      )
    const sent = await sendEach(server, tool, base, flags.each, rows, flags.batch, note)
    answer = sent.answer
    failure = sent.error
    kept = sent.calls > 0
    summary = `${n(sent.rows)} of ${n(rows.length)} rows sent in ${n(sent.calls)} call${sent.calls === 1 ? '' : 's'}`
  } else if (flags.all) {
    answer = await readAll(server, tool, base, note)
  } else answer = await callTool(server, name, base)

  if (kept) {
    if (flags.pick?.length) answer = pick(answer, flags.pick)
    if (flags.out) {
      const what = await writeAnswer(flags.out, answer ?? null)
      out(`${summary ? `${summary}; ` : ''}wrote ${what} to ${flags.out}`)
    } else {
      if (summary) note(summary)
      out(JSON.stringify(answer ?? null, null, 2))
    }
  }
  if (failure) throw failure
}

/** The commands main knows; the skills' test checks every `dylan …` they show against it. */
export const COMMANDS = [
  'login',
  'logout',
  'whoami',
  'autopilot',
  'tools',
  'tool',
  'call',
  'help',
] as const

export async function main(argv: string[]) {
  const { flags, rest } = parseArgs(argv)
  const [command, ...args] = rest
  if (flags.version) return out(VERSION)
  if (flags.help || !command || command === 'help') return out(HELP)
  const server = serverOf(flags.server)
  switch (command) {
    case 'login': {
      await login(server, { browser: flags.browser })
      const me = (await request(server, 'GET', '/v1/me')) as {
        email: string
        organisation: string | null
      }
      return out(`Signed in as ${me.email}${me.organisation ? ` to ${me.organisation}` : ''}`)
    }
    case 'logout':
      return out((await logout(server)) ? 'Signed out' : 'Not signed in')
    case 'whoami': {
      const me = (await request(server, 'GET', '/v1/me')) as {
        email: string
        organisation: string | null
      }
      return out(`${me.email}${me.organisation ? ` in ${me.organisation}` : ''} on ${server}`)
    }
    case 'autopilot': {
      if (args.length > 1)
        throw usage(
          'Usage: dylan autopilot [--project <slug>] [--json]',
          'dylan --help lists options',
        )
      const snapshot = await fetchAutopilot(server, flags.project ?? args[0])
      return out(flags.json ? JSON.stringify(snapshot, null, 2) : formatAutopilot(snapshot))
    }
    case 'tools': {
      const all = await tools(server)
      if (flags.json) return out(JSON.stringify(all, null, 2))
      const width = Math.max(...all.map((t) => t.name.length))
      return out(
        all.map((t) => `${t.name.padEnd(width)}  ${kindOf(t).padEnd(6)}  ${t.title}`).join('\n'),
      )
    }
    case 'tool': {
      if (!args[0]) throw usage('Name the tool: dylan tool <name>')
      const t = await toolNamed(server, args[0])
      return out(flags.json ? JSON.stringify(t, null, 2) : describeTool(t))
    }
    case 'call': {
      const [name, ...fields] = args
      if (!name)
        throw usage('Name the tool: dylan call <tool> [name=value ...]', 'dylan tools lists them')
      return call(server, name, fields, flags)
    }
    default:
      throw usage(`Unknown command ${command}`, 'dylan --help lists them')
  }
}

const isMain = (() => {
  try {
    return (
      Boolean(process.argv[1]) && realpathSync(process.argv[1]!) === fileURLToPath(import.meta.url)
    )
  } catch {
    return false
  }
})()
if (isMain)
  main(process.argv.slice(2)).catch((error: unknown) => {
    if (error instanceof DylanError) {
      process.stderr.write(`dylan: ${error.message}\n`)
      if (error.hint) process.stderr.write(`hint: ${error.hint}\n`)
      if (error.details !== undefined && error.details !== null)
        process.stderr.write(`details: ${JSON.stringify(error.details)}\n`)
      process.exit(error.exitCode)
    }
    process.stderr.write(`dylan: ${(error as Error)?.stack ?? error}\n`)
    process.exit(1)
  })
