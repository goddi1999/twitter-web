import { requestJson } from '@/lib/request-json'

export type AdminSession = { token: string; expiresAt: number }

/** Exchange username + password for a signed session token. */
export async function signIn(username: string, password: string): Promise<AdminSession> {
  const payload = await requestJson('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('token' in payload) ||
    !('expiresAt' in payload) ||
    typeof payload.token !== 'string' ||
    typeof payload.expiresAt !== 'number'
  ) {
    throw new Error('Unexpected response from /api/admin/login.')
  }
  return { token: payload.token, expiresAt: payload.expiresAt }
}
