import { error, json, options } from '../lib/http'
import { listPosts } from '../lib/posts'

export const config = {
  runtime: 'edge',
  regions: ['fra1'],
}

/** GET /api/posts — list recent posts (feed for the Vite UI). */
export async function GET() {
  try {
    const posts = await listPosts()
    return json({ posts })
  } catch (err) {
    console.error('GET /api/posts failed', err)
    return error(err instanceof Error ? err.message : 'Internal error', 500)
  }
}

export function OPTIONS() {
  return options()
}
