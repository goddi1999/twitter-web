import { getAllPosts, getStoredPost, savePost } from './store'

export const MAX_TEXT_LENGTH = 280

export type Author = {
  displayName: string
  handle: string
  avatarUrl: string
}

export type CommentDto = {
  id: string
  text: string
  timestamp: string
  author: Author
}

export type PostDto = {
  id: string
  text: string
  likeCount: number
  comments: CommentDto[]
  author: Author
  createdAt: string
}

const DEFAULT_AUTHOR: Author = {
  displayName: 'HSRT Student',
  handle: 'hsrtstudent',
  avatarUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=hsrt',
}

export function assertValidText(text: unknown, label = 'Text'): string {
  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new Error(`${label} darf nicht leer sein.`)
  }
  const trimmed = text.trim()
  if (trimmed.length > MAX_TEXT_LENGTH) {
    throw new Error(`${label} darf maximal ${MAX_TEXT_LENGTH} Zeichen lang sein.`)
  }
  return trimmed
}

export function normalizeAuthor(input: unknown): Author {
  if (!input || typeof input !== 'object') {
    return DEFAULT_AUTHOR
  }
  const raw = input as Record<string, unknown>
  const displayName =
    typeof raw.displayName === 'string' && raw.displayName.trim()
      ? raw.displayName.trim()
      : DEFAULT_AUTHOR.displayName
  const handle =
    typeof raw.handle === 'string' && raw.handle.trim()
      ? raw.handle.trim().replace(/^@/, '')
      : DEFAULT_AUTHOR.handle
  const avatarUrl =
    typeof raw.avatarUrl === 'string' && raw.avatarUrl.trim()
      ? raw.avatarUrl.trim()
      : DEFAULT_AUTHOR.avatarUrl
  return { displayName, handle, avatarUrl }
}

export function listPosts(): PostDto[] {
  return getAllPosts()
}

export function getPost(postId: string): PostDto | null {
  return getStoredPost(postId) ?? null
}

export function createPost(text: string, author: Author): PostDto {
  const post: PostDto = {
    id: crypto.randomUUID(),
    text,
    likeCount: 0,
    comments: [],
    author,
    createdAt: new Date().toISOString(),
  }
  return savePost(post)
}

export function likePost(postId: string): PostDto | null {
  const existing = getStoredPost(postId)
  if (!existing) return null
  return savePost({ ...existing, likeCount: existing.likeCount + 1 })
}

export function addComment(
  postId: string,
  text: string,
  author: Author,
): PostDto | null {
  const existing = getStoredPost(postId)
  if (!existing) return null
  const comment: CommentDto = {
    id: crypto.randomUUID(),
    text,
    timestamp: new Date().toISOString(),
    author,
  }
  return savePost({
    ...existing,
    comments: [...existing.comments, comment],
  })
}

export function removeComment(postId: string, commentId: string): PostDto | null {
  const existing = getStoredPost(postId)
  if (!existing) return null
  const next = existing.comments.filter((c) => c.id !== commentId)
  if (next.length === existing.comments.length) {
    throw new Error('Kommentar nicht gefunden.')
  }
  return savePost({ ...existing, comments: next })
}
