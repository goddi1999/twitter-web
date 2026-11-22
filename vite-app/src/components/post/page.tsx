import { DemoPage } from '../demo-page'

import { FeedError } from './FeedError'
import { PostEmptyState } from './PostEmptyState'
import { PostFeed } from './PostFeed'
import { useFeed } from './use-feed'

type PostPageProps = {
  /** Opens the composer from the empty state. */
  onCreatePost: () => void
}

export function PostPage({ onCreatePost }: PostPageProps) {
  const { state, reload, moderate } = useFeed()

  return (
    <DemoPage title="For You" align="center" className="max-w-7xl pt-6">
      <div className="w-full pb-24">
        {state.status === 'loading' ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading posts…</p>
        ) : state.status === 'error' ? (
          <FeedError message={state.message} onRetry={reload} />
        ) : (
          <PostFeed
            key={state.feed.posts.map((p) => p.id).join(',')}
            initialPosts={state.feed.posts}
            hiddenIds={state.feed.hiddenIds}
            onModerate={moderate}
            empty={
              <PostEmptyState
                canWrite={moderate !== undefined}
                onCreate={onCreatePost}
                onTestPostPublished={reload}
              />
            }
          />
        )}
      </div>
    </DemoPage>
  )
}
