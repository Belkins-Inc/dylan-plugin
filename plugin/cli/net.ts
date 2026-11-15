import { DylanError } from './errors.ts'

/** How long a sign-in step, the list of tools or the person's own details may take. */
export const QUICK_MS = 30_000

/**
 * How long a tool may take to answer: five minutes, or DYLAN_TIMEOUT_MS. Research and sourcing
 * tools take a while; a hung server must not hold an agent for undici's own five minutes per wait.
 */
export const TOOL_MS = Number(process.env['DYLAN_TIMEOUT_MS']) || 300_000

/** fetch that gives up after `ms`; a timeout or a failed connection is a DylanError saying which. */
export async function fetchWithin(
  url: string,
  init: RequestInit,
  ms: number,
  hint = 'Check the connection, then run the command again',
): Promise<Response> {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(ms) })
  } catch (error) {
    const origin = new URL(url).origin
    if ((error as Error).name === 'TimeoutError')
      throw new DylanError(
        `${origin} did not answer in ${Math.round(ms / 100) / 10} s`,
        init.method && init.method !== 'GET'
          ? 'It may still be working on it: check before running a write again (DYLAN_TIMEOUT_MS waits longer)'
          : 'Run the command again in a minute (DYLAN_TIMEOUT_MS waits longer)',
      )
    throw new DylanError(`Cannot reach ${origin}: ${(error as Error).message}`, hint)
  }
}
