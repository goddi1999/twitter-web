import type { PostDto } from './posts'

/** Ephemeral in-memory store (Edge-safe, no DB). Resets on cold start. */
const posts = new Map<string, PostDto>()

export function getAllPosts(): PostDto[] {
  return [...posts.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getStoredPost(id: string): PostDto | undefined {
  return posts.get(id)
}

export function savePost(post: PostDto): PostDto {
  posts.set(post.id, post)
  return post
}

export function deleteStoredPost(id: string): boolean {
  return posts.delete(id)
}
