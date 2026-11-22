import { isAdminRequest } from '../lib/admin-auth.js'
import { error, json, options } from '../lib/http.js'
import {
  getModerationStates,
  isModerationConfigured,
  type ModerationState,
} from '../lib/moderation.js'
import { listPosts, listPublishes } from '../lib/posts.js'

export const config = {
  runtime: 'nodejs',
  regions: ['fra1'],
  maxDuration: 30,
}

/**
 * GET /api/posts
 *
 * - `posts`: grouped by `post.id` → latest publish only (feed)
 * - `publishes`: full append log (every publish, including older versions)
 *
 * Hidden and deleted posts are left out. With a valid admin token, hidden posts are
 * included and marked `moderation: "hidden"`; deleted posts are never returned.
 */
export async function GET(request: Request) {
  try {
    const admin = isAdminRequest(request)
    const [posts, publishes, states] = await Promise.all([
      listPosts(),
      listPublishes(),
      // without the service key the feed still works, just unmoderated
      isModerationConfigured()
        ? getModerationStates()
        : Promise.resolve(new Map<string, ModerationState>()),
    ])

    const visible = (id: string) => {
      const state = states.get(id)
      return state === undefined || (admin && state === 'hidden')
    }

    return json({
      posts: posts
        .filter((post) => visible(post.id))
        .map((post) => (states.has(post.id) ? { ...post, moderation: states.get(post.id) } : post)),
      publishes: publishes.filter((post) => !states.has(post.id)),
    })
  } catch (err) {
    console.error('GET /api/posts failed', err)
    return error(err instanceof Error ? err.message : 'Internal error', 500)
  }
}

export function OPTIONS() {
  return options()
}
