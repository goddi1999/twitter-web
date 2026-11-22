import { useState, type ReactNode } from 'react'

import { FieldInput } from '@/components/ui/field-input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { PostCard } from './PostCard'
import { PostGroupTabs } from './PostGroupTabs'
import { PostThread } from './PostThread'
import type { ModerationAction } from './post.api'
import type { Post } from './post.model'

const CARD_WIDTH = '18.75rem'

type PostFeedProps = {
  initialPosts?: Post[]
  /** Rendered instead of the feed when there are no posts at all. */
  empty?: ReactNode
  /** Admin only: ids of hidden posts, shown dimmed. */
  hiddenIds?: ReadonlySet<string>
  /** Admin only: shows the ⋯ menu on every card. */
  onModerate?: (post: Post, action: ModerationAction) => Promise<void>
  className?: string
}

function matchesDescription(post: Post, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (normalized.length === 0) return true
  return post.getText().toLowerCase().includes(normalized)
}

export function PostFeed({ initialPosts, empty, hiddenIds, onModerate, className }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(() => initialPosts ?? [])
  const [query, setQuery] = useState('')
  const [groupPostId, setGroupPostId] = useState<string | null>(null)
  const [openPostId, setOpenPostId] = useState<string | null>(null)

  const filteredPosts = posts.filter((post) => {
    if (groupPostId !== null && post.id !== groupPostId) return false
    return matchesDescription(post, query)
  })
  const openPost = posts.find((post) => post.id === openPostId) ?? null

  function bumpPosts() {
    setPosts((current) => [...current])
  }

  function handleLike(post: Post) {
    post.like()
    bumpPosts()
  }

  function handleOpen(post: Post) {
    setOpenPostId(post.id)
  }

  if (posts.length === 0 && empty) {
    return <div className={cn('w-full text-left', className)}>{empty}</div>
  }

  return (
    <div className={cn('w-full text-left', className)}>
      <div className="mx-auto mb-6 w-full max-w-xl space-y-3">
        <FieldInput
          label="Search posts"
          placeholder="Filter by description…"
          value={query}
          onValueChange={setQuery}
          type="search"
          autoComplete="off"
          showClearButton
        />
        <PostGroupTabs posts={posts} activePostId={groupPostId} onSelect={setGroupPostId} />
      </div>

      <div
        className="grid justify-center gap-4"
        style={{ gridTemplateColumns: `repeat(auto-fill, ${CARD_WIDTH})` }}
      >
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onOpen={handleOpen}
            onLike={handleLike}
            hidden={hiddenIds?.has(post.id) ?? false}
            onModerate={onModerate}
          />
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No posts match that filter.
        </p>
      ) : null}

      <Sheet
        open={openPostId !== null}
        onOpenChange={(open) => {
          if (!open) setOpenPostId(null)
        }}
      >
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Thread</SheetTitle>
            <SheetDescription>Post and comments</SheetDescription>
          </SheetHeader>
          {openPost ? (
            <PostThread
              post={openPost}
              onBack={() => setOpenPostId(null)}
              onLike={handleLike}
              className="min-h-0 flex-1"
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
