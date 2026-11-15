import { spawn } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'

import { type Credential, credentialFor, saveCredential, withLock } from './config.ts'
import { DylanError } from './errors.ts'
import { fetchWithin, QUICK_MS } from './net.ts'

// Signing in: OAuth 2.1 with PKCE in the person's browser, the code coming back to a port on this
// machine (RFC 8252). The client is Dylan's own command line, named by the metadata document the
// server publishes for it, so the person sees "Dylan CLI" at consent and picks the organisation
// there. The access token lives an hour and is renewed with the refresh token, which rotates.

const CLIENT_PATH = '/oauth/clients/dylan-cli.json'
/** How long the person has to sign in: the server keeps the request ten minutes. */
const WAIT_MS = 10 * 60_000
/** Renew a token this long before it runs out, so a call never starts with a dying one. */
const MARGIN_MS = 60_000

type ServerMetadata = {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  revocation_endpoint?: string
}

type TokenAnswer = {
  access_token: string
  refresh_token: string
  expires_in?: number
}

async function metadataOf(server: string): Promise<ServerMetadata> {
  const res = await fetchWithin(
    `${server}/.well-known/oauth-authorization-server`,
    {},
    QUICK_MS,
    'Check the connection, or DYLAN_URL if it is set',
  )
  if (!res.ok)
    throw new DylanError(
      `${server} answered ${res.status} where Dylan's sign-in should be`,
      'Check DYLAN_URL if it is set',
    )
  return (await res.json()) as ServerMetadata
}

const base64url = (bytes: Buffer) => bytes.toString('base64url')

/** Posts a form to the token endpoint; an OAuth refusal becomes a DylanError. */
async function tokenRequest(endpoint: string, fields: Record<string, string>) {
  const res = await fetchWithin(
    endpoint,
    {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(fields).toString(),
    },
    QUICK_MS,
  )
  const body = (await res.json().catch(() => ({}))) as Partial<TokenAnswer> & {
    error?: string
    error_description?: string
  }
  if (!res.ok || !body.access_token || !body.refresh_token)
    throw new DylanError(
      body.error_description ?? `Signing in failed (${res.status})`,
      'Run: dylan login',
      1,
      body.error ?? 'sign_in_failed',
    )
  return body as TokenAnswer
}

const credentialOf = (
  meta: Pick<ServerMetadata, 'token_endpoint' | 'revocation_endpoint'>,
  clientId: string,
  t: TokenAnswer,
): Credential => ({
  clientId,
  tokenEndpoint: meta.token_endpoint,
  ...(meta.revocation_endpoint ? { revocationEndpoint: meta.revocation_endpoint } : {}),
  accessToken: t.access_token,
  refreshToken: t.refresh_token,
  expiresAt: Date.now() + (t.expires_in ?? 3600) * 1000,
})

/** Opens a link in the person's browser; where none can be opened, the printed link is enough. */
function openBrowser(url: string) {
  const [command, args] =
    process.platform === 'darwin'
      ? ['open', [url]]
      : process.platform === 'win32'
        ? ['cmd', ['/c', 'start', '""', url.replace(/&/g, '^&')]]
        : ['xdg-open', [url]]
  try {
    const child = spawn(command as string, args as string[], { stdio: 'ignore', detached: true })
    child.on('error', () => {})
    child.unref()
  } catch {
    // The link is printed; the person opens it.
  }
}

const PAGE = (title: string, text: string) =>
  `<!doctype html><meta charset="utf-8"><title>Dylan</title><body style="font:16px system-ui;margin:4rem auto;max-width:28rem"><h1 style="font-size:1.4rem">${title}</h1><p>${text}</p>`

/**
 * Signs the person in: prints the link (and opens it unless told not to), waits for the code on a
 * loopback port, exchanges it and keeps the tokens for this server.
 */
export async function login(server: string, options: { browser: boolean }) {
  const meta = await metadataOf(server)
  const clientId = `${meta.issuer}${CLIENT_PATH}`
  const verifier = base64url(randomBytes(32))
  const challenge = base64url(createHash('sha256').update(verifier).digest())
  const state = base64url(randomBytes(16))

  const http = createServer()
  await new Promise<void>((resolve, reject) => {
    http.once('error', reject)
    http.listen(0, '127.0.0.1', resolve)
  })
  const { port } = http.address() as AddressInfo
  const redirect = `http://127.0.0.1:${port}/callback`
  const authorize = new URL(meta.authorization_endpoint)
  for (const [k, v] of Object.entries({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirect,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state,
    scope: 'mcp',
    resource: meta.issuer,
  }))
    authorize.searchParams.set(k, v)

  process.stderr.write(`Sign in to Dylan in your browser:\n\n  ${authorize}\n\nWaiting…\n`)
  if (options.browser) openBrowser(authorize.toString())

  let code: string
  try {
    code = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(
        () =>
          reject(new DylanError('Nobody signed in within ten minutes', 'Run: dylan login again')),
        WAIT_MS,
      )
      http.on('request', (req, res) => {
        const url = new URL(req.url ?? '/', redirect)
        if (url.pathname !== '/callback') {
          res.writeHead(404).end()
          return
        }
        const done = (ok: boolean, text: string) => {
          res.writeHead(ok ? 200 : 400, { 'content-type': 'text/html; charset=utf-8' })
          res.end(PAGE(ok ? 'Signed in' : 'Not signed in', text))
        }
        const q = url.searchParams
        if (q.get('state') !== state) {
          done(false, 'This answer is not for this sign-in.')
          return
        }
        clearTimeout(timer)
        if (q.get('iss') && q.get('iss') !== meta.issuer) {
          done(false, 'The answer came from another server.')
          reject(new DylanError('The sign-in answer came from another server', 'Run: dylan login'))
        } else if (q.get('error')) {
          done(false, q.get('error_description') ?? 'The sign-in was refused.')
          reject(
            new DylanError(
              q.get('error_description') ?? 'The sign-in was refused',
              'Run: dylan login, and allow access on the page',
              1,
              q.get('error') ?? undefined,
            ),
          )
        } else if (!q.get('code')) {
          done(false, 'No code came back.')
          reject(new DylanError('No code came back from the sign-in', 'Run: dylan login'))
        } else {
          done(true, 'You can close this tab and go back to your agent.')
          resolve(q.get('code') as string)
        }
      })
    })
  } finally {
    http.close()
    http.closeAllConnections()
  }

  const tokens = await tokenRequest(meta.token_endpoint, {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirect,
    client_id: clientId,
    code_verifier: verifier,
    resource: meta.issuer,
  })
  await withLock(() => saveCredential(server, credentialOf(meta, clientId, tokens)))
}

/** Signs out: the server forgets the refresh token, and this machine forgets both. */
export async function logout(server: string) {
  const credential = await credentialFor(server)
  if (!credential) return false
  if (credential.revocationEndpoint)
    await fetchWithin(
      credential.revocationEndpoint,
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token: credential.refreshToken,
          token_type_hint: 'refresh_token',
          client_id: credential.clientId,
        }).toString(),
      },
      QUICK_MS,
    ).catch(() => {})
  await withLock(() => saveCredential(server, null))
  return true
}

const notSignedIn = () =>
  new DylanError(
    'Not signed in to Dylan',
    'Run: dylan login (or set DYLAN_API_KEY to a key made in Dylan’s app)',
    1,
    'unauthenticated',
  )

/**
 * The bearer to call with: DYLAN_API_KEY when set, else this server's sign-in, renewed when it is
 * about to run out — or now, when `renew` says the server refused it.
 */
export async function bearer(server: string, renew = false): Promise<string> {
  const key = process.env['DYLAN_API_KEY']
  if (key) {
    if (renew)
      throw new DylanError(
        'Dylan refused the key in DYLAN_API_KEY',
        'Make a new key in Dylan’s app, or unset DYLAN_API_KEY and run: dylan login',
        1,
        'unauthenticated',
      )
    return key
  }
  const held = await credentialFor(server)
  if (!held) throw notSignedIn()
  if (!renew && held.expiresAt - MARGIN_MS > Date.now()) return held.accessToken
  return withLock(async () => {
    // Another command may have renewed it while this one waited for the lock.
    const now = await credentialFor(server)
    if (!now) throw notSignedIn()
    if (now.accessToken !== held.accessToken && now.expiresAt - MARGIN_MS > Date.now())
      return now.accessToken
    let tokens: TokenAnswer
    try {
      tokens = await tokenRequest(now.tokenEndpoint, {
        grant_type: 'refresh_token',
        refresh_token: now.refreshToken,
        client_id: now.clientId,
      })
    } catch (error) {
      if (error instanceof DylanError && error.code === 'invalid_grant') {
        await saveCredential(server, null)
        throw new DylanError(
          'The sign-in ended (it was revoked, expired or used elsewhere)',
          'Run: dylan login',
          1,
          'unauthenticated',
        )
      }
      throw error
    }
    const next: Credential = {
      ...now,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
    }
    await saveCredential(server, next)
    return next.accessToken
  })
}
