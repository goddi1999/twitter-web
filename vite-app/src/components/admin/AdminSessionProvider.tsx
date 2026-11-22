import { useEffect, useState, type ReactNode } from 'react'

import { signIn as requestSignIn, type AdminSession } from './admin.api'
import {
  AdminSessionContext,
  readStoredSession,
  writeStoredSession,
  type AdminSessionValue,
} from './admin-session-context'

/** Holds the admin sign-in for the whole app and signs out when the token expires. */
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => readStoredSession())

  useEffect(() => {
    if (!session) return
    const timer = window.setTimeout(
      () => {
        writeStoredSession(null)
        setSession(null)
      },
      Math.max(0, session.expiresAt - Date.now())
    )
    return () => window.clearTimeout(timer)
  }, [session])

  async function signIn(username: string, password: string) {
    const next = await requestSignIn(username, password)
    writeStoredSession(next)
    setSession(next)
  }

  function signOut() {
    writeStoredSession(null)
    setSession(null)
  }

  const value: AdminSessionValue = {
    token: session?.token ?? null,
    isAdmin: session !== null,
    signIn,
    signOut,
  }

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>
}
