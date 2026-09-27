import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/** Server-only Supabase client for Vercel Functions. */
export function getSupabase(): SupabaseClient {
  if (client) return client

  const url = process.env.SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL und SUPABASE_PUBLISHABLE_KEY müssen gesetzt sein.',
    )
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}
