/**
 * What went wrong, what to do about it, and the exit code: 1 when Dylan refused or a call failed,
 * 2 when the command itself was wrong. The message, the hint and the refusal's details (which rows
 * of a batch were refused, and why) reach the agent verbatim.
 */
export class DylanError extends Error {
  readonly hint: string | undefined
  readonly exitCode: number
  readonly code: string | undefined
  readonly details: unknown
  constructor(message: string, hint?: string, exitCode = 1, code?: string, details?: unknown) {
    super(message)
    this.hint = hint
    this.exitCode = exitCode
    this.code = code
    this.details = details
  }
}

/** A command used wrongly: exit code 2. */
export const usage = (message: string, hint?: string) => new DylanError(message, hint, 2)
