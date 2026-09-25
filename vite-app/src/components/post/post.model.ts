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

  constructor(text: string, author: Author, createdAt: Date = new Date()) {
    this.id = createId('comment')
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

  constructor(text: string, author: Author, createdAt: Date = new Date()) {
    this.id = createId('post')
    this.text = assertValidText(text)
    this.likeCount = 0
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

export { MAX_TEXT_LENGTH }
