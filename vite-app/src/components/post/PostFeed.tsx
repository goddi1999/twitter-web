import { useEffect, useRef, useState } from 'react'

import { FieldInput } from '@/components/ui/field-input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { createDemoPostBatch, createDemoPosts } from './demo-data'
import { PostCard } from './PostCard'
import { PostGroupTabs } from './PostGroupTabs'
import { PostThread } from './PostThread'
import type { Post } from './post.model'

const BATCH_SIZE = 8
const CARD_WIDTH = '18.75rem'

type PostFeedProps = {
  initialPosts?: Post[]
  className?: string
}

function matchesDescription(post: Post, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (normalized.length === 0) return true
  return post.getText().toLowerCase().includes(normalized)
}

export function PostFeed({ initialPosts, className }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(() => initialPosts ?? createDemoPosts())
  const [query, setQuery] = useState('')
  const [groupPostId, setGroupPostId] = useState<string | null>(null)
  const [openPostId, setOpenPostId] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const batchOffsetRef = useRef(initialPosts?.length ?? BATCH_SIZE)
  const loadingRef = useRef(false)

  const filteredPosts = posts.filter((post) => {
    if (groupPostId !== null && post.id !== groupPostId) return false
    return matchesDescription(post, query)
  })
  const openPost = posts.find((post) => post.id === openPostId) ?? null
  const isFiltering = query.trim().length > 0 || groupPostId !== null

  const postCountByHandle = new Map<string, number>()
  for (const post of posts) {
    const handle = post.getAuthor().handle
    postCountByHandle.set(handle, (postCountByHandle.get(handle) ?? 0) + 1)
  }

  function isVerified(handle: string): boolean {
    return (postCountByHandle.get(handle) ?? 0) > 3
  }

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

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || loadingRef.current || isFiltering) return

        loadingRef.current = true
        setIsLoadingMore(true)

        const next = createDemoPostBatch(BATCH_SIZE, batchOffsetRef.current)
        batchOffsetRef.current += next.length
        setPosts((current) => [...current, ...next])
        setIsLoadingMore(false)

        window.setTimeout(() => {
          loadingRef.current = false
        }, 300)
      },
      { root: null, rootMargin: '240px', threshold: 0 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [isFiltering])

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
        <PostGroupTabs
          posts={posts}
          activePostId={groupPostId}
          onSelect={setGroupPostId}
        />
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
            verified={isVerified(post.getAuthor().handle)}
          />
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No posts match that filter.
        </p>
      ) : null}

      <div
        ref={sentinelRef}
        className="flex h-16 items-center justify-center text-sm text-muted-foreground"
      >
        {!isFiltering && isLoadingMore ? 'Loading…' : null}
      </div>

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
              isVerified={isVerified}
              className="min-h-0 flex-1"
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
