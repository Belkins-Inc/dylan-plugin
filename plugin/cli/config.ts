import { chmod, mkdir, open, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

import { DylanError } from './errors.ts'

// Where Dylan is and who is signed in. The server is DYLAN_URL or Dylan's own; a sign-in is kept
// per server in a file only its owner reads (credentials.json, mode 600), and DYLAN_API_KEY — a key
// made in Dylan's app — stands in for it in scripts.

export const DEFAULT_SERVER = 'https://mcp.meetdylan.ai'

export const serverOf = (flag?: string) =>
  (flag ?? process.env['DYLAN_URL'] ?? DEFAULT_SERVER).replace(/\/+$/, '')

export const configDir = () =>
  process.env['DYLAN_CONFIG_DIR'] ??
  join(process.env['XDG_CONFIG_HOME'] ?? join(homedir(), '.config'), 'dylan')

/** One sign-in: the tokens the server issued and where to renew them. */
export type Credential = {
  clientId: string
  tokenEndpoint: string
  revocationEndpoint?: string
  accessToken: string
  refreshToken: string
  /** Epoch milliseconds. */
  expiresAt: number
}

type Store = Record<string, Credential>

const storePath = () => join(configDir(), 'credentials.json')

export async function readStore(): Promise<Store> {
  try {
    return JSON.parse(await readFile(storePath(), 'utf8')) as Store
  } catch {
    return {}
  }
}

/** Written whole and renamed into place, readable by its owner alone. */
async function writeStore(store: Store) {
  await mkdir(configDir(), { recursive: true, mode: 0o700 })
  const tmp = `${storePath()}.${process.pid}.tmp`
  await writeFile(tmp, `${JSON.stringify(store, null, 2)}\n`, { mode: 0o600 })
  await chmod(tmp, 0o600)
  await rename(tmp, storePath())
}

export async function credentialFor(server: string) {
  return (await readStore())[server]
}

export async function saveCredential(server: string, credential: Credential | null) {
  const store = await readStore()
  if (credential) store[server] = credential
  else delete store[server]
  await writeStore(store)
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Runs `work` while holding the credentials' lock, so two commands never renew the same refresh
 * token: the server takes each one once, and a second use of it signs the person out everywhere.
 * A lock older than a minute is a crashed command's and is taken over.
 */
export async function withLock<T>(work: () => Promise<T>): Promise<T> {
  await mkdir(configDir(), { recursive: true, mode: 0o700 })
  const lock = join(configDir(), 'credentials.lock')
  const deadline = Date.now() + 30_000
  for (;;) {
    try {
      const handle = await open(lock, 'wx')
      await handle.writeFile(String(Date.now()))
      await handle.close()
      break
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
      const since = Number(await readFile(lock, 'utf8').catch(() => '0'))
      if (since && Date.now() - since > 60_000) await rm(lock, { force: true })
      else if (Date.now() > deadline)
        throw new DylanError(
          'Another dylan command is holding the sign-in',
          `Wait for it to finish, or remove ${lock} if none is running`,
        )
      else await sleep(100)
    }
  }
  try {
    return await work()
  } finally {
    await rm(lock, { force: true })
  }
}
