import { useContext } from 'react'

import { AdminSessionContext, type AdminSessionValue } from './admin-session-context'

export function useAdminSession(): AdminSessionValue {
  const value = useContext(AdminSessionContext)
  if (!value) throw new Error('useAdminSession must be used inside <AdminSessionProvider>.')
  return value
}
