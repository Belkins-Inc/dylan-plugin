/**
 * What went wrong, what to do about it, and the exit code: 1 when Dylan refused or a call failed,
 * 2 when the command itself was wrong. The message and the hint reach the agent verbatim.
 */
export class DylanError extends Error {
  readonly hint: string | undefined
  readonly exitCode: number
  readonly code: string | undefined
  constructor(message: string, hint?: string, exitCode = 1, code?: string) {
    super(message)
    this.hint = hint
    this.exitCode = exitCode
    this.code = code
  }
}

/** A command used wrongly: exit code 2. */
export const usage = (message: string, hint?: string) => new DylanError(message, hint, 2)
