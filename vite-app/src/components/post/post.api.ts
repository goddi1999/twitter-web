import {
  getRandomAvatar,
  withImageUrl,
  type MemojiWithImageUrl,
} from '@wq-org/avatars'

import { Post } from './post.model'
import type { Author } from './post.types'

export function authorFromMemoji(avatar: MemojiWithImageUrl): Author {
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

/** Append one full post snapshot via `POST /api/post`. */
export async function publishPost(post: Post, avatarId: string): Promise<void> {
  const response = await fetch('/api/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      post: {
        id: post.id,
        text: post.getText(),
        likeCount: post.getLikeCount(),
        comments: [],
        createdAt: post.getCreatedAt().toISOString(),
        avatarId,
      },
    }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string
    } | null
    throw new Error(payload?.error ?? `Publish failed (${response.status})`)
  }
}

/** Publish a throwaway post from a random memoji, for testing the feed. */
export async function publishTestPost(): Promise<Post> {
  const avatar = withImageUrl(getRandomAvatar())
  const stamp = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const post = new Post(
    `Test post from ${avatar.name} at ${stamp}.`,
    authorFromMemoji(avatar),
    new Date(),
    { id: crypto.randomUUID() },
  )
  await publishPost(post, avatar.id)
  return post
}
