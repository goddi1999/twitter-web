import { useEffect, useState } from 'react'

import { DemoPage } from '../demo-page'

import { PostFeed } from './PostFeed'
import { postFromApi, type ApiPost, type Post } from './post.model'

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; posts: Post[] }
  | { status: 'error'; message: string }

export function PostPage() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/posts', {
          headers: { Accept: 'application/json' },
        })
        const payload = (await response.json().catch(() => null)) as {
          posts?: ApiPost[]
          error?: string
        } | null

        if (!response.ok) {
          throw new Error(payload?.error ?? `Failed to load posts (${response.status})`)
        }

        const posts = (payload?.posts ?? []).map(postFromApi)
        if (!cancelled) setState({ status: 'ready', posts })
      } catch (err) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to load posts',
          })
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <DemoPage
      eyebrow="shared / post"
      title="Post"
      description="Fixed-width cards in a responsive grid. Text clamps at four lines with Expand; scroll for more."
      align="center"
      className="max-w-7xl"
    >
      <div className="w-full pb-24">
        {state.status === 'loading' ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading posts…
          </p>
        ) : state.status === 'error' ? (
          <p className="py-10 text-center text-sm text-destructive">{state.message}</p>
        ) : (
          <PostFeed key={state.posts.map((p) => p.id).join(',')} initialPosts={state.posts} />
        )}
      </div>
    </DemoPage>
  )
}
