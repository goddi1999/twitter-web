import { createContext } from 'react'

import type { AdminSession } from './admin.api'

export type AdminSessionValue = {
  /** Bearer token while signed in, otherwise null. */
  token: string | null
  isAdmin: boolean
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => void
}

export const AdminSessionContext = createContext<AdminSessionValue | null>(null)

export const SESSION_STORAGE_KEY = 'twitter-web.admin-session'

/** A stored session, if it is still valid. Storage can be missing or blocked. */
export function readStoredSession(now = Date.now()): AdminSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AdminSession>
    if (typeof parsed.token !== 'string' || typeof parsed.expiresAt !== 'number') return null
    return parsed.expiresAt > now ? { token: parsed.token, expiresAt: parsed.expiresAt } : null
  } catch {
    return null
  }
}

export function writeStoredSession(session: AdminSession | null): void {
  try {
    if (session) window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    else window.localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // storage blocked (private mode): the session just lasts for this page view
  }
}
