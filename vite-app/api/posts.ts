import { error, json, options } from '../lib/http.js'
import { listPosts, listPublishes } from '../lib/posts.js'

export const config = {
  runtime: 'edge',
  regions: ['fra1'],
}

/**
 * GET /api/posts
 *
 * - `posts`: grouped by `post.id` → latest publish only (feed)
 * - `publishes`: full append log (every publish, including older versions)
 */
export async function GET() {
  try {
    return json({
      posts: listPosts(),
      publishes: listPublishes(),
    })
  } catch (err) {
    console.error('GET /api/posts failed', err)
    return error(err instanceof Error ? err.message : 'Internal error', 500)
  }
}

export function OPTIONS() {
  return options()
}
