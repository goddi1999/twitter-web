import { error, json, options, readJson } from '../../lib/http'
import { likePost } from '../../lib/posts'

export const config = {
  runtime: 'edge',
  regions: ['fra1'],
}

type LikeBody = {
  postId?: unknown
}

/**
 * POST /api/post/like
 * Body: { "postId": "<uuid>" }
 */
export async function POST(request: Request) {
  try {
    const body = await readJson<LikeBody>(request)
    if (typeof body.postId !== 'string' || !body.postId.trim()) {
      return error('postId ist erforderlich.')
    }
    const post = await likePost(body.postId.trim())
    if (!post) {
      return error('Post nicht gefunden.', 404)
    }
    return json({ post })
  } catch (err) {
    console.error('POST /api/post/like failed', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    const status = message.includes('JSON') ? 400 : 500
    return error(message, status)
  }
}

export function OPTIONS() {
  return options()
}
