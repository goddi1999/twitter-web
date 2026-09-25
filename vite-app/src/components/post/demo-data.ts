import { getRandomAvatar, withImageUrl } from '@wq-org/avatars'

import { Comment, Post } from './post.model'
import type { Author } from './post.types'

function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60_000)
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 3_600_000)
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

export function createDemoPosts(): Post[] {
  const authors = [randomAuthor(), randomAuthor(), randomAuthor(), randomAuthor(), randomAuthor()]

  const posts: Post[] = [
    new Post(
      'Just shipped a reusable Post component with likes and threaded comments. Clean structure, Card + BlurredScrollArea, random wq avatars.',
      authors[0],
      hoursAgo(1),
    ),
    new Post(
      'Working through the Post API today: like() only increments, text max 280, comments carry text + timestamp. Domain first, UI second.',
      authors[1],
      hoursAgo(3),
    ),
    new Post(
      'Thread view open in a Sheet: one post, vertical reply line, MessageCircle + Heart. Feels close to the reference without cloning the whole app chrome.',
      authors[2],
      hoursAgo(5),
    ),
    new Post(
      'Tiny reminder: empty text is invalid, and setText throws when you go over 280. Keep the model honest.',
      authors[3],
      minutesAgo(40),
    ),
    new Post(
      'Demo seed with a handful of posts so BlurredScrollArea actually has something to fade. Click a card to open the thread.',
      authors[4],
      minutesAgo(12),
    ),
  ]

  posts[0].addComment(
    new Comment('This layout looks solid — love the relative timestamps.', authors[1], minutesAgo(50)),
  )
  posts[0].addComment(
    new Comment('Does open() use a Sheet? Nice touch.', authors[2], minutesAgo(35)),
  )
  posts[0].like()
  posts[0].like()
  posts[0].like()

  posts[1].addComment(new Comment('Domain classes make the React layer so much thinner.', authors[0], hoursAgo(2)))
  posts[1].like()

  posts[2].addComment(new Comment('Replying to the thread line specifically — that reads well.', authors[3], hoursAgo(4)))
  posts[2].addComment(new Comment('Heart + MessageCircle is enough for v1.', authors[4], hoursAgo(3)))
  posts[2].addComment(new Comment('Skipping retweet/share was the right call.', authors[0], hoursAgo(2)))
  posts[2].like()
  posts[2].like()

  posts[3].addComment(
    new Comment('Good — keep validation in the model, not only the form.', authors[2], minutesAgo(25)),
  )
  posts[3].like()

  posts[4].addComment(new Comment('Opening from the feed feels natural.', authors[1], minutesAgo(8)))
  posts[4].like()
  posts[4].like()
  posts[4].like()
  posts[4].like()

  return posts
}
