import {
  getRandomAvatar,
  withImageUrl,
  type MemojiWithImageUrl,
} from '@wq-org/avatars'

import { Post, postFromApi, type ApiPost } from './post.model'
import type { Author } from './post.types'

const API_UNREACHABLE = import.meta.env.DEV
  ? 'Can’t reach the posts API. Start it with `npx vercel dev`, then try again.'
  : 'Can’t reach the posts API. Check your connection and try again.'

/**
 * fetch + JSON with honest errors: a network failure or a non-JSON reply (e.g. plain
 * `vite` serving the api/ source file) means the API is unreachable, not "no data".
 */
async function requestJson(input: string, init?: RequestInit): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(input, {
      ...init,
      headers: { Accept: 'application/json', ...init?.headers },
    })
  } catch {
    throw new Error(API_UNREACHABLE)
  }

  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(API_UNREACHABLE)
  }

  const payload: unknown = await response.json()
  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'error' in payload
        ? String(payload.error)
        : `Request failed (${response.status})`
    throw new Error(message)
  }
  return payload
}

/** Latest snapshot per post id, from `GET /api/posts`. */
export async function fetchPosts(): Promise<Post[]> {
  const payload = await requestJson('/api/posts')
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('posts' in payload) ||
    !Array.isArray(payload.posts)
  ) {
    throw new Error('Unexpected response from /api/posts.')
  }
  return (payload.posts as ApiPost[]).map(postFromApi)
}

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
  await requestJson('/api/post', {
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
