import { error, json, options, readJson } from '../../lib/http.js'
import { getPost, parseFullPost, publishPost } from '../../lib/posts.js'

export const config = {
  runtime: 'edge',
  regions: ['fra1'],
}

type PublishBody = {
  /** Full post document — always include comments + likeCount. Never send avatarUrl. */
  post?: unknown
}

/**
 * POST /api/post
 *
 * Append-only publish. The client sends the **entire** post after any local change
 * (create, like, add/remove comment). We only store — we never overwrite a previous
 * publish. Supabase will replace this log later.
 *
 * Do **not** send `displayName`, `handle`, or `avatarUrl` — the server picks a random
 * `@wq-org/avatars` memoji and uses its `name` (+ derived handle + CDN url).
 *
 * Body: { "post": { id, text, likeCount, comments, createdAt? } }
 * `post.id` is required so publishes can be grouped later.
 */
export async function POST(request: Request) {
  try {
    const body = await readJson<PublishBody>(request)
    const rawPost =
      body.post && typeof body.post === 'object'
        ? (body.post as Record<string, unknown>)
        : null
    const existingId =
      rawPost && typeof rawPost.id === 'string' && rawPost.id.trim()
        ? rawPost.id.trim()
        : null
    const previous = existingId ? getPost(existingId) : null
    const parsed = parseFullPost(body.post, previous)
    const post = publishPost(parsed)
    return json({ post }, 201)
  } catch (err) {
    console.error('POST /api/post failed', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    const status =
      message.includes('darf') ||
      message.includes('muss') ||
      message.includes('erforderlich') ||
      message.includes('ungültig') ||
      message.includes('JSON')
        ? 400
        : 500
    return error(message, status)
  }
}

export function OPTIONS() {
  return options()
}
