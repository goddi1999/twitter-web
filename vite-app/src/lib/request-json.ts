const API_UNREACHABLE = import.meta.env.DEV
  ? 'Can’t reach the posts API. Start it with `npx vercel dev`, then try again.'
  : 'Can’t reach the posts API. Check your connection and try again.'

/** An error reply from our API, with its HTTP status (0 = never reached the server). */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/**
 * fetch + JSON with honest errors: a network failure or a non-JSON reply (e.g. plain
 * `vite` serving the api/ source file) means the API is unreachable, not "no data".
 */
export async function requestJson(input: string, init?: RequestInit): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(input, {
      ...init,
      headers: { Accept: 'application/json', ...init?.headers },
    })
  } catch {
    throw new ApiError(API_UNREACHABLE, 0)
  }

  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new ApiError(API_UNREACHABLE, 0)
  }

  const payload: unknown = await response.json()
  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'error' in payload
        ? String(payload.error)
        : `Request failed (${response.status})`
    throw new ApiError(message, response.status)
  }
  return payload
}

/** `Authorization` header for an admin token, or none. */
export function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
