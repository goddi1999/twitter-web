/// <reference types="node" />
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/** How long a sign-in lasts. */
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000

type AdminConfig = { username: string; password: string; secret: string }

export class AdminNotConfiguredError extends Error {
  constructor() {
    super('Admin sign-in is not configured on the server.')
  }
}

/** Credentials and signing secret come only from server env — never from the client bundle. */
function readConfig(): AdminConfig {
  const username = process.env.ADMIN_USERNAME?.trim()
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!username || !password || !secret) throw new AdminNotConfiguredError()
  return { username, password, secret }
}

/** Constant-time compare of two strings of any length (hashing first hides the length). */
function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) => createHash('sha256').update(value).digest()
  return timingSafeEqual(digest(a), digest(b))
}

const toBase64Url = (value: string | Buffer) => Buffer.from(value).toString('base64url')

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function checkCredentials(username: string, password: string): boolean {
  const config = readConfig()
  // evaluate both, so a wrong username takes as long as a wrong password
  const userOk = safeEqual(username.trim(), config.username)
  const passOk = safeEqual(password, config.password)
  return userOk && passOk
}

export function issueToken(now = Date.now()): { token: string; expiresAt: number } {
  const config = readConfig()
  const expiresAt = now + TOKEN_TTL_MS
  const payload = toBase64Url(JSON.stringify({ sub: config.username, exp: expiresAt }))
  return { token: `${payload}.${sign(payload, config.secret)}`, expiresAt }
}

export function verifyToken(token: string, now = Date.now()): boolean {
  const config = readConfig()
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra !== undefined) return false
  if (!safeEqual(signature, sign(payload, config.secret))) return false
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub?: unknown
      exp?: unknown
    }
    return claims.sub === config.username && typeof claims.exp === 'number' && claims.exp > now
  } catch {
    return false
  }
}

/** True when the request carries a valid `Authorization: Bearer <token>`. */
export function isAdminRequest(request: Request): boolean {
  const header = request.headers.get('authorization') ?? ''
  const match = /^Bearer\s+(.+)$/i.exec(header)
  if (!match) return false
  try {
    return verifyToken(match[1].trim())
  } catch (err) {
    if (err instanceof AdminNotConfiguredError) return false
    throw err
  }
}
