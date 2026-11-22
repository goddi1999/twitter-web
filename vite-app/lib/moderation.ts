/// <reference types="node" />
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type ModerationAction = 'hide' | 'unhide' | 'delete'
export type ModerationState = 'hidden' | 'deleted'

export const MODERATION_ACTIONS: readonly ModerationAction[] = ['hide', 'unhide', 'delete']

export class ModerationNotConfiguredError extends Error {
  constructor() {
    super('Moderation is not configured on the server (SUPABASE_SERVICE_ROLE_KEY missing).')
  }
}

let client: SupabaseClient | null = null

/**
 * Service-role client for `moderation_actions`. The table has RLS on and no policies, so the
 * public key (shipped inside the Java client) can neither read nor forge moderation.
 */
function getServiceSupabase(): SupabaseClient {
  if (client) return client
  const url = process.env.SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) throw new ModerationNotConfiguredError()
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  return client
}

export function isModerationConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
}

type ActionRow = { post_id: string; action: ModerationAction }

/** Current state per post: the newest action wins; `unhide` clears it. */
export async function getModerationStates(): Promise<Map<string, ModerationState>> {
  const { data, error } = await getServiceSupabase()
    .from('moderation_actions')
    .select('post_id, action')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Supabase lesen fehlgeschlagen: ${error.message}`)

  const states = new Map<string, ModerationState>()
  const seen = new Set<string>()
  for (const row of (data ?? []) as ActionRow[]) {
    if (seen.has(row.post_id)) continue
    seen.add(row.post_id)
    if (row.action === 'hide') states.set(row.post_id, 'hidden')
    if (row.action === 'delete') states.set(row.post_id, 'deleted')
  }
  return states
}

/** Append one action. A deleted post stays deleted: later actions are refused. */
export async function recordModeration(
  postId: string,
  action: ModerationAction
): Promise<ModerationState | null> {
  const current = (await getModerationStates()).get(postId)
  if (current === 'deleted') throw new Error('Dieser Post ist bereits gelöscht.')

  const { error } = await getServiceSupabase()
    .from('moderation_actions')
    .insert({ post_id: postId, action })
  if (error) throw new Error(`Supabase schreiben fehlgeschlagen: ${error.message}`)

  return action === 'hide' ? 'hidden' : action === 'delete' ? 'deleted' : null
}
