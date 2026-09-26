import type { PostDto } from './posts.js'

/**
 * Append-only publish log (Edge-safe, no DB).
 * Never overwrites — each client publish is a new entry.
 * Group by `post.id`: the newest entry for an id is the current snapshot.
 * Resets on cold start; will move to Supabase later.
 */
const publishes: PostDto[] = []

/** Full append log, newest first. */
export function getAllPublishes(): PostDto[] {
  return [...publishes].reverse()
}

/**
 * One row per `post.id` — the latest publish for that id.
 * Order: most recently published post first.
 */
export function getLatestPostsById(): PostDto[] {
  const seen = new Set<string>()
  const latest: PostDto[] = []

  for (let i = publishes.length - 1; i >= 0; i -= 1) {
    const entry = publishes[i]
    if (!entry || seen.has(entry.id)) continue
    seen.add(entry.id)
    latest.push(entry)
  }

  return latest
}

/** Latest publish for a logical post id, or undefined. */
export function getLatestPublish(postId: string): PostDto | undefined {
  for (let i = publishes.length - 1; i >= 0; i -= 1) {
    if (publishes[i]?.id === postId) {
      return publishes[i]
    }
  }
  return undefined
}

/** Append only — never replaces an existing entry. */
export function appendPublish(post: PostDto): PostDto {
  publishes.push(post)
  return post
}
