import { useState } from 'react'
import { Inbox, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

import { publishTestPost } from './post.api'

type PostEmptyStateProps = {
  onCreate: () => void
  /** Called after a test post was published, so the feed can reload. */
  onTestPostPublished: () => void
}

export function PostEmptyState({ onCreate, onTestPostPublished }: PostEmptyStateProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleTestPost() {
    setIsPublishing(true)
    setError(null)
    try {
      await publishTestPost()
      onTestPostPublished()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish test post')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <Empty className="mx-auto max-w-xl border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>No posts yet</EmptyTitle>
        <EmptyDescription>
          Posts you publish show up here. Write your first one, or add a test post to see
          the feed.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button type="button" size="lg" className="h-11 w-full rounded-full" onClick={onCreate}>
          <Plus />
          Create post
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-11 w-full rounded-full"
          disabled={isPublishing}
          onClick={() => void handleTestPost()}
        >
          {isPublishing ? 'Adding…' : 'Add a test post'}
        </Button>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </EmptyContent>
    </Empty>
  )
}
