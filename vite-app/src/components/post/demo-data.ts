import { getRandomAvatar, withImageUrl } from '@wq-org/avatars'

import { Comment, Post } from './post.model'
import type { Author } from './post.types'

const SAMPLE_TEXTS = [
  'Just shipped a reusable Post component with likes and threaded comments. Clean structure, Card + BlurredScrollArea, random wq avatars.',
  'Working through the Post API today: like() only increments, text max 280, comments carry text + timestamp. Domain first, UI second. Keep validation in the model so the UI stays thin and honest about empty or oversized text.',
  'Thread view open in a Sheet: one post, vertical reply line, MessageCircle + Heart. Feels close to the reference without cloning the whole app chrome. Expand the card text when it runs past four lines.',
  'Tiny reminder: empty text is invalid, and setText throws when you go over 280. Keep the model honest.',
  'Demo seed with a handful of posts so the grid actually fills. Scroll down to load more cards with endless scroll. Click a card to open the thread Sheet on the side.',
  'Grid layout uses a fixed card width and auto-fill columns so wider screens show more posts side by side. Icons stay left; Expand sits on the right under clamped text.',
  'Relative timestamps only — no AM/PM calendar strings. Avatars come from @wq-org/avatars getRandomAvatar with CDN imageUrl attached for the Avatar image.',
  'Comments are seeded for the demo. addComment and removeComment live on the Post class even when the thread UI is read-only in v1.',
]

function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60_000)
}

function randomAuthor(): Author {
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

function decoratePost(post: Post, authors: Author[], index: number): void {
  const commentAuthor = authors[(index + 1) % authors.length]
  post.addComment(
    new Comment('Nice take — thanks for sharing.', commentAuthor, minutesAgo(5 + index)),
  )
  if (index % 2 === 0) {
    post.addComment(
      new Comment('Opening the thread from the grid feels natural.', authors[index % authors.length], minutesAgo(2 + index)),
    )
  }
  const likes = (index % 4) + 1
  for (let i = 0; i < likes; i += 1) {
    post.like()
  }
}

export function createDemoPostBatch(count: number, offset = 0): Post[] {
  const authors = Array.from({ length: Math.min(count, 8) }, () => randomAuthor())
  const posts: Post[] = []

  for (let i = 0; i < count; i += 1) {
    const text = SAMPLE_TEXTS[(offset + i) % SAMPLE_TEXTS.length]
    const author = authors[i % authors.length]
    const post = new Post(text, author, minutesAgo(10 + offset + i * 7))
    decoratePost(post, authors, offset + i)
    posts.push(post)
  }

  return posts
}

export function createDemoPosts(): Post[] {
  return createDemoPostBatch(8)
}
