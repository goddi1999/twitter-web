import { useState } from 'react'

import { BlurredScrollArea } from '@/components/ui/blurred-scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { createDemoPosts } from './demo-data'
import { PostCard } from './PostCard'
import { PostThread } from './PostThread'
import type { Post } from './post.model'

type PostFeedProps = {
  initialPosts?: Post[]
  className?: string
}

export function PostFeed({ initialPosts, className }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(() => initialPosts ?? createDemoPosts())
  const [openPostId, setOpenPostId] = useState<string | null>(null)

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

  return (
    <div className={cn('flex h-[min(70vh,40rem)] flex-col overflow-hidden rounded-xl border border-border bg-background', className)}>
      <BlurredScrollArea className="min-h-0 flex-1" hideScrollBar>
        <div className="divide-y-0">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOpen={handleOpen}
              onLike={handleLike}
            />
          ))}
        </div>
      </BlurredScrollArea>

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
