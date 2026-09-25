import { error, json, options, readJson } from '../../lib/http'
import { assertValidText, createPost, normalizeAuthor } from '../../lib/posts'

export const config = {
  runtime: 'edge',
  regions: ['fra1'],
}

type CreateBody = {
  text?: unknown
  author?: unknown
}

/**
 * POST /api/post
 * Body: { "text": "Hallo Hochschule Reutlingen!", "author"?: { displayName, handle, avatarUrl } }
 */
export async function POST(request: Request) {
  try {
    const body = await readJson<CreateBody>(request)
    const text = assertValidText(body.text)
    const author = normalizeAuthor(body.author)
    const post = await createPost(text, author)
    return json({ post }, 201)
  } catch (err) {
    console.error('POST /api/post failed', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    const status = message.includes('darf') || message.includes('JSON') ? 400 : 500
    return error(message, status)
  }
}

export function OPTIONS() {
  return options()
}
