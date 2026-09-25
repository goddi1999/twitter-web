import { error, json, options, readJson } from '../../lib/http'
import {
  addComment,
  assertValidText,
  normalizeAuthor,
  removeComment,
} from '../../lib/posts'

export const config = {
  runtime: 'edge',
  regions: ['fra1'],
}

type CommentBody = {
  postId?: unknown
  commentId?: unknown
  text?: unknown
  author?: unknown
}

/**
 * POST /api/post/comment
 * Body: { "postId": "<uuid>", "text": "Cooler Beitrag!", "author"?: {...} }
 */
export async function POST(request: Request) {
  try {
    const body = await readJson<CommentBody>(request)
    if (typeof body.postId !== 'string' || !body.postId.trim()) {
      return error('postId ist erforderlich.')
    }
    const text = assertValidText(body.text, 'Kommentar')
    const author = normalizeAuthor(body.author)
    const post = await addComment(body.postId.trim(), text, author)
    if (!post) {
      return error('Post nicht gefunden.', 404)
    }
    return json({ post }, 201)
  } catch (err) {
    console.error('POST /api/post/comment failed', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    const status = message.includes('darf') || message.includes('JSON') ? 400 : 500
    return error(message, status)
  }
}

/**
 * DELETE /api/post/comment
 * Body: { "postId": "<uuid>", "commentId": "<uuid>" }
 */
export async function DELETE(request: Request) {
  try {
    const body = await readJson<CommentBody>(request)
    if (typeof body.postId !== 'string' || !body.postId.trim()) {
      return error('postId ist erforderlich.')
    }
    if (typeof body.commentId !== 'string' || !body.commentId.trim()) {
      return error('commentId ist erforderlich.')
    }
    const post = await removeComment(body.postId.trim(), body.commentId.trim())
    if (!post) {
      return error('Post nicht gefunden.', 404)
    }
    return json({ post })
  } catch (err) {
    console.error('DELETE /api/post/comment failed', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    if (message.includes('JSON')) return error(message, 400)
    if (message.includes('nicht gefunden')) return error(message, 404)
    return error(message, 500)
  }
}

export function OPTIONS() {
  return options()
}
