import { bearer } from './auth.ts'
import { DylanError } from './errors.ts'

// Dylan's public API: the same tools as its MCP server, one POST each, the same answers and the
// same refusals ({ error: { code, message, hint } }).

export const VERSION = '0.1.2'

/** A JSON Schema, as far as this command line reads one. */
export type Schema = {
  type?: string | string[]
  properties?: Record<string, Schema>
  required?: string[]
  items?: Schema
  anyOf?: Schema[]
  enum?: unknown[]
  description?: string
  maxItems?: number
  maximum?: number
  additionalProperties?: boolean | Schema
}

export type Tool = {
  name: string
  title: string
  description: string
  inputSchema: Schema
  annotations: {
    readOnlyHint?: boolean
    destructiveHint?: boolean
    idempotentHint?: boolean
    openWorldHint?: boolean
  }
}

type Refusal = { code?: string; message?: string; hint?: string }

async function send(server: string, method: string, path: string, body: unknown, renew: boolean) {
  const token = await bearer(server, renew)
  try {
    return await fetch(`${server}${path}`, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/json',
        'user-agent': `dylan-cli/${VERSION}`,
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
  } catch (error) {
    throw new DylanError(
      `Cannot reach ${server}: ${(error as Error).message}`,
      'Check the connection, then run the command again',
    )
  }
}

/** One request as the signed-in person; a refused token is renewed once and the call repeated. */
export async function request(server: string, method: string, path: string, body?: unknown) {
  let res = await send(server, method, path, body, false)
  if (res.status === 401) res = await send(server, method, path, body, true)
  const text = await res.text()
  let parsed: unknown = null
  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = null
  }
  if (!res.ok) {
    const answer = parsed as { error?: Refusal | string; message?: string; hint?: string } | null
    const refusal: Refusal =
      answer && typeof answer.error === 'object'
        ? answer.error
        : { message: answer?.message ?? (text.slice(0, 300) || res.statusText), hint: answer?.hint }
    throw new DylanError(
      refusal.message ?? `Dylan answered ${res.status}`,
      refusal.hint,
      1,
      refusal.code ?? String(res.status),
    )
  }
  return parsed
}

let toolsCache: Promise<Tool[]> | null = null

export function tools(server: string): Promise<Tool[]> {
  toolsCache ??= request(server, 'GET', '/v1/tools') as Promise<Tool[]>
  return toolsCache
}

export async function toolNamed(server: string, name: string): Promise<Tool> {
  const all = await tools(server)
  const found = all.find((t) => t.name === name)
  if (!found) {
    const near = all
      .map((t) => t.name)
      .filter((n) => n.includes(name) || name.includes(n.split('_')[1] ?? '\0'))
      .slice(0, 5)
    throw new DylanError(
      `No tool named ${name}`,
      near.length
        ? `Did you mean ${near.join(', ')}? (dylan tools lists them)`
        : 'dylan tools lists them',
      2,
    )
  }
  return found
}

export const callTool = (server: string, name: string, input: Record<string, unknown>) =>
  request(server, 'POST', `/v1/tools/${encodeURIComponent(name)}`, input)
