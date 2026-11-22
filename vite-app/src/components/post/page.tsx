import { useEffect, useState } from 'react'
import { CloudOff, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

import { DemoPage } from '../demo-page'

import { PostEmptyState } from './PostEmptyState'
import { PostFeed } from './PostFeed'
import { fetchPosts } from './post.api'
import type { Post } from './post.model'

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; posts: Post[] }
  | { status: 'error'; message: string }

type PostPageProps = {
  /** Opens the composer from the empty state. */
  onCreatePost: () => void
}

function FeedError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Empty className="mx-auto max-w-xl border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CloudOff />
        </EmptyMedia>
        <EmptyTitle>Couldn’t load posts</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button type="button" size="lg" className="h-11 w-full rounded-full" onClick={onRetry}>
          <RefreshCw />
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export function PostPage({ onCreatePost }: PostPageProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [reloadToken, setReloadToken] = useState(0)

  function reload() {
    setState({ status: 'loading' })
    setReloadToken((token) => token + 1)
  }

  useEffect(() => {
    let cancelled = false

    fetchPosts().then(
      (posts) => {
        if (!cancelled) setState({ status: 'ready', posts })
      },
      (err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to load posts.',
          })
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  return (
    <DemoPage title="For You" align="center" className="max-w-7xl pt-6">
      <div className="w-full pb-24">
        {state.status === 'loading' ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading posts…</p>
        ) : state.status === 'error' ? (
          <FeedError message={state.message} onRetry={reload} />
        ) : (
          <PostFeed
            key={state.posts.map((p) => p.id).join(',')}
            initialPosts={state.posts}
            empty={<PostEmptyState onCreate={onCreatePost} onTestPostPublished={reload} />}
          />
        )}
      </div>
    </DemoPage>
  )
}
