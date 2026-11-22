import { AdminNotConfiguredError, checkCredentials, issueToken } from '../../lib/admin-auth.js'
import { error, json, options, readJson } from '../../lib/http.js'

export const config = {
  runtime: 'nodejs',
  regions: ['fra1'],
  maxDuration: 10,
}

type LoginBody = { username?: unknown; password?: unknown }

/**
 * POST /api/admin/login
 * Body: { "username": "…", "password": "…" } → 200 { token, expiresAt } | 401 | 503
 */
export async function POST(request: Request) {
  try {
    const body = await readJson<LoginBody>(request)
    const username = typeof body.username === 'string' ? body.username : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!username || !password) return error('Username and password are required.', 400)

    // one message for both cases, so the form never reveals which part was wrong
    if (!checkCredentials(username, password)) {
      return error('Wrong username or password.', 401)
    }
    return json(issueToken())
  } catch (err) {
    if (err instanceof AdminNotConfiguredError) return error(err.message, 503)
    console.error('POST /api/admin/login failed', err)
    return error(err instanceof Error ? err.message : 'Internal error', 500)
  }
}

export function OPTIONS() {
  return options()
}
