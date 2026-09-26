import { getRandomAvatar, withImageUrl } from '@wq-org/avatars'

import { appendPublish, getAllPublishes, getLatestPostsById, getLatestPublish } from './store'

export const MAX_TEXT_LENGTH = 280

/** Stored / response author — fully server-assigned from @wq-org/avatars. */
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

/** Pick a random memoji and map it to Author (name → displayName + handle). */
export function randomAuthor(): Author {
  const avatar = withImageUrl(getRandomAvatar())
  const handle = avatar.name.toLowerCase().replace(/[^a-z0-9]+/g, '')
  if (!handle) {
    throw new Error(`Could not derive handle from avatar name: ${avatar.name}`)
  }
  return {
    displayName: avatar.name,
    handle,
    avatarUrl: avatar.imageUrl,
  }
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

/**
 * Author identity is server-owned. Client must not send displayName / avatarUrl / handle —
 * any `author` field on the request is ignored.
 * Reuses the previous author when republishing the same post/comment id.
 */
export function resolveAuthor(_input: unknown, previous?: Author): Author {
  return previous ?? randomAuthor()
}

function assertNonNegativeInt(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(`${label} muss eine nicht-negative Ganzzahl sein.`)
  }
  return value
}

function parseComment(
  input: unknown,
  index: number,
  previousById: Map<string, CommentDto>,
): CommentDto {
  if (!input || typeof input !== 'object') {
    throw new Error(`comments[${index}] ist ungültig.`)
  }
  const raw = input as Record<string, unknown>
  const id =
    typeof raw.id === 'string' && raw.id.trim()
      ? raw.id.trim()
      : crypto.randomUUID()
  const text = assertValidText(raw.text, `Kommentar[${index}]`)
  const timestamp =
    typeof raw.timestamp === 'string' && raw.timestamp.trim()
      ? raw.timestamp.trim()
      : new Date().toISOString()
  const previous = previousById.get(id)
  const author = resolveAuthor(raw.author, previous?.author)
  return { id, text, timestamp, author }
}

/**
 * Accepts a full post document for a new publish.
 * Client must not send avatarUrl — server assigns random wq-avatars URLs.
 */
export function parseFullPost(input: unknown, previous?: PostDto | null): PostDto {
  if (!input || typeof input !== 'object') {
    throw new Error('post ist erforderlich.')
  }
  const raw = input as Record<string, unknown>

  const text = assertValidText(raw.text)
  const likeCount =
    raw.likeCount === undefined ? 0 : assertNonNegativeInt(raw.likeCount, 'likeCount')

  if (raw.comments !== undefined && !Array.isArray(raw.comments)) {
    throw new Error('comments muss ein Array sein.')
  }

  if (typeof raw.id !== 'string' || !raw.id.trim()) {
    throw new Error('post.id ist erforderlich.')
  }
  const id = raw.id.trim()

  const existing = previous ?? getLatestPublish(id) ?? null
  const previousComments = new Map(
    (existing?.comments ?? []).map((comment) => [comment.id, comment]),
  )

  const comments = Array.isArray(raw.comments)
    ? raw.comments.map((comment, index) =>
        parseComment(comment, index, previousComments),
      )
    : []

  const author = resolveAuthor(raw.author, existing?.author)
  const createdAt =
    typeof raw.createdAt === 'string' && raw.createdAt.trim()
      ? raw.createdAt.trim()
      : (existing?.createdAt ?? new Date().toISOString())

  return { id, text, likeCount, comments, author, createdAt }
}

/** Feed: latest snapshot per `post.id`, newest publish first. */
export function listPosts(): PostDto[] {
  return getLatestPostsById()
}

/** Raw append log (every publish), newest first — for debugging / history. */
export function listPublishes(): PostDto[] {
  return getAllPublishes()
}

export function getPost(postId: string): PostDto | null {
  return getLatestPublish(postId) ?? null
}

/**
 * Append a publish. Never overwrites prior entries.
 * Likes / comment changes from the app are just another publish of the full post.
 */
export function publishPost(post: PostDto): PostDto {
  return appendPublish(post)
}
