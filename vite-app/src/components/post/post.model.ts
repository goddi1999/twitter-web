import type { Author } from './post.types'

const MAX_TEXT_LENGTH = 280

function assertValidText(text: string): string {
  const trimmed = text.trim()
  if (trimmed.length === 0) {
    throw new Error('Text must not be empty')
  }
  if (trimmed.length > MAX_TEXT_LENGTH) {
    throw new Error(`Text must be at most ${MAX_TEXT_LENGTH} characters`)
  }
  return trimmed
}

let nextId = 0
function createId(prefix: string): string {
  nextId += 1
  return `${prefix}-${nextId}`
}

export class Comment {
  readonly id: string
  private text: string
  private readonly createdAt: Date
  private readonly author: Author

  constructor(
    text: string,
    author: Author,
    createdAt: Date = new Date(),
    id: string = createId('comment'),
  ) {
    this.id = id
    this.text = assertValidText(text)
    this.author = author
    this.createdAt = createdAt
  }

  getText(): string {
    return this.text
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getAuthor(): Author {
    return this.author
  }
}

export class Post {
  readonly id: string
  private text: string
  private likeCount: number
  private readonly comments: Comment[]
  private readonly author: Author
  private readonly createdAt: Date

  constructor(
    text: string,
    author: Author,
    createdAt: Date = new Date(),
    options?: { id?: string; likeCount?: number },
  ) {
    this.id = options?.id ?? createId('post')
    this.text = assertValidText(text)
    this.likeCount = options?.likeCount ?? 0
    this.comments = []
    this.author = author
    this.createdAt = createdAt
  }

  getText(): string {
    return this.text
  }

  setText(text: string): void {
    this.text = assertValidText(text)
  }

  getLikeCount(): number {
    return this.likeCount
  }

  like(): void {
    this.likeCount += 1
  }

  getComments(): Comment[] {
    return [...this.comments]
  }

  addComment(comment: Comment): void {
    this.comments.push(comment)
  }

  removeComment(comment: Comment): void {
    const index = this.comments.indexOf(comment)
    if (index !== -1) {
      this.comments.splice(index, 1)
    }
  }

  getAuthor(): Author {
    return this.author
  }

  getCreatedAt(): Date {
    return this.createdAt
  }
}

export type ApiAuthor = {
  displayName?: string
  handle?: string
  avatarUrl?: string
}

export type ApiComment = {
  id?: string
  text: string
  timestamp?: string
  author?: ApiAuthor
}

export type ApiPost = {
  id: string
  text: string
  likeCount?: number
  comments?: ApiComment[]
  author?: ApiAuthor
  createdAt?: string
}

function parseTimestamp(value: string | undefined, fallback: Date): Date {
  if (!value?.trim()) return fallback
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? fallback : parsed
}

function authorFromApi(raw: ApiAuthor | undefined): Author {
  const displayName = raw?.displayName?.trim() || 'Unknown'
  const handle = raw?.handle?.trim() || 'unknown'
  const avatarUrl = raw?.avatarUrl?.trim() || ''
  return { displayName, handle, avatarUrl }
}

/** Hydrate domain models from GET /api/posts JSON. */
export function postFromApi(dto: ApiPost): Post {
  const createdAt = parseTimestamp(dto.createdAt, new Date())
  const post = new Post(dto.text, authorFromApi(dto.author), createdAt, {
    id: dto.id,
    likeCount: typeof dto.likeCount === 'number' ? dto.likeCount : 0,
  })

  for (const comment of dto.comments ?? []) {
    post.addComment(
      new Comment(
        comment.text,
        authorFromApi(comment.author),
        parseTimestamp(comment.timestamp, createdAt),
        comment.id?.trim() || createId('comment'),
      ),
    )
  }

  return post
}

export { MAX_TEXT_LENGTH }
