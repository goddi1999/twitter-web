import { isAdminRequest } from '../../lib/admin-auth.js'
import { error, json, options, readJson } from '../../lib/http.js'
import {
  MODERATION_ACTIONS,
  ModerationNotConfiguredError,
  recordModeration,
  type ModerationAction,
} from '../../lib/moderation.js'

export const config = {
  runtime: 'nodejs',
  regions: ['fra1'],
  maxDuration: 30,
}

type ModerateBody = { postId?: unknown; action?: unknown }

const isAction = (value: unknown): value is ModerationAction =>
  typeof value === 'string' && (MODERATION_ACTIONS as readonly string[]).includes(value)

/**
 * POST /api/admin/moderate — admin only (`Authorization: Bearer <token>`).
 * Body: { "postId": "…", "action": "hide" | "unhide" | "delete" } → 200 { postId, state }
 */
export async function POST(request: Request) {
  if (!isAdminRequest(request)) return error('Please sign in again.', 401)

  try {
    const body = await readJson<ModerateBody>(request)
    const postId = typeof body.postId === 'string' ? body.postId.trim() : ''
    if (!postId) return error('postId is required.', 400)
    if (!isAction(body.action)) return error('action must be hide, unhide or delete.', 400)

    const state = await recordModeration(postId, body.action)
    return json({ postId, state })
  } catch (err) {
    if (err instanceof ModerationNotConfiguredError) return error(err.message, 503)
    const message = err instanceof Error ? err.message : 'Internal error'
    if (message.includes('gelöscht')) return error(message, 409)
    console.error('POST /api/admin/moderate failed', err)
    return error(message, 500)
  }
}

export function OPTIONS() {
  return options()
}
