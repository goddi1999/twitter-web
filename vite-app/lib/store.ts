import type { PostDto } from './posts'

/**
 * Append-only publish log (Edge-safe, no DB).
 * Never overwrites — each client publish is a new entry.
 * Resets on cold start; will move to Supabase later.
 */
const publishes: PostDto[] = []

/** All publishes, newest first. */
export function getAllPublishes(): PostDto[] {
  return [...publishes].reverse()
}

/** Latest publish for a logical post id (avatar reuse), or undefined. */
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
