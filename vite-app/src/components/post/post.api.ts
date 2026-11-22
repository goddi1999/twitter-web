import { getRandomAvatar, withImageUrl, type MemojiWithImageUrl } from '@wq-org/avatars'

import { authHeaders, requestJson } from '@/lib/request-json'

import { Post, postFromApi, type ApiPost } from './post.model'
import type { Author } from './post.types'

export type ModerationAction = 'hide' | 'unhide' | 'delete'

export type Feed = {
  posts: Post[]
  /** Ids the admin hid; only ever filled when an admin token was sent. */
  hiddenIds: ReadonlySet<string>
}

type FeedPost = ApiPost & { moderation?: 'hidden' }

/** Latest snapshot per post id, from `GET /api/posts`. An admin token also returns hidden posts. */
export async function fetchPosts(token: string | null = null): Promise<Feed> {
  const payload = await requestJson('/api/posts', { headers: authHeaders(token) })
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('posts' in payload) ||
    !Array.isArray(payload.posts)
  ) {
    throw new Error('Unexpected response from /api/posts.')
  }
  const rows = payload.posts as FeedPost[]
  return {
    posts: rows.map(postFromApi),
    hiddenIds: new Set(rows.filter((row) => row.moderation === 'hidden').map((row) => row.id)),
  }
}

/** Admin only: hide, unhide or delete a post. */
export async function moderatePost(
  token: string,
  postId: string,
  action: ModerationAction
): Promise<void> {
  await requestJson('/api/admin/moderate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ postId, action }),
  })
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
    { id: crypto.randomUUID() }
  )
  await publishPost(post, avatar.id)
  return post
}
