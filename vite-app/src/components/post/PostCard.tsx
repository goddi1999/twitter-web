import { BadgeCheck, Heart, MessageCircle } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { formatRelativeTime } from './format-relative-time'
import type { Post } from './post.model'
import type { Author } from './post.types'

type PostCardProps = {
  post: Post
  onOpen?: (post: Post) => void
  onLike?: (post: Post) => void
  className?: string
  /** Larger body text for thread hero. */
  emphasis?: 'feed' | 'thread'
}

function AuthorRow({
  author,
  createdAt,
  compact,
}: {
  author: Author
  createdAt: Date
  compact?: boolean
}) {
  const initials = author.displayName.slice(0, 2).toUpperCase()

  return (
    <div className="flex min-w-0 items-start gap-3">
      <Avatar size={compact ? 'sm' : 'default'} className="mt-0.5">
        <AvatarImage src={author.avatarUrl} alt={author.displayName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm leading-tight">
          <span className="truncate font-semibold text-foreground">{author.displayName}</span>
          <BadgeCheck
            className="size-4 shrink-0 fill-sky-500 text-sky-500"
            aria-label="Verified"
          />
          <span className="truncate text-muted-foreground">@{author.handle}</span>
          <span className="text-muted-foreground">·</span>
          <time
            className="shrink-0 text-muted-foreground"
            dateTime={createdAt.toISOString()}
          >
            {formatRelativeTime(createdAt)}
          </time>
        </div>
      </div>
    </div>
  )
}

function ActionBar({
  post,
  onOpen,
  onLike,
  showCounts = true,
}: {
  post: Post
  onOpen?: (post: Post) => void
  onLike?: (post: Post) => void
  showCounts?: boolean
}) {
  const commentCount = post.getComments().length
  const likeCount = post.getLikeCount()

  return (
    <div className="flex max-w-md items-center justify-between gap-4 pt-1 text-muted-foreground">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-xs transition-colors hover:text-sky-500"
        onClick={(event) => {
          event.stopPropagation()
          onOpen?.(post)
        }}
        aria-label={`${commentCount} comments`}
      >
        <MessageCircle className="size-4" />
        {showCounts ? <span>{commentCount}</span> : null}
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-xs transition-colors hover:text-rose-500"
        onClick={(event) => {
          event.stopPropagation()
          onLike?.(post)
        }}
        aria-label={`Like, ${likeCount} likes`}
      >
        <Heart className="size-4" />
        {showCounts ? <span>{likeCount}</span> : null}
      </button>
    </div>
  )
}

export function PostCard({
  post,
  onOpen,
  onLike,
  className,
  emphasis = 'feed',
}: PostCardProps) {
  const author = post.getAuthor()
  const createdAt = post.getCreatedAt()

  return (
    <Card
      layout="flush"
      variant="soft"
      role="article"
      tabIndex={onOpen ? 0 : undefined}
      className={cn(
        'cursor-pointer border-0 bg-transparent shadow-none ring-0',
        'rounded-none border-b border-border/60 py-3 transition-colors hover:bg-muted/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      onClick={() => onOpen?.(post)}
      onKeyDown={(event) => {
        if (!onOpen) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(post)
        }
      }}
    >
      <CardContent className="px-4">
        <AuthorRow author={author} createdAt={createdAt} />
        <p
          className={cn(
            'mt-2 whitespace-pre-wrap text-foreground',
            emphasis === 'thread' ? 'text-[17px] leading-relaxed' : 'text-[15px] leading-snug',
          )}
        >
          {post.getText()}
        </p>
        <ActionBar post={post} onOpen={onOpen} onLike={onLike} showCounts />
      </CardContent>
    </Card>
  )
}

export { AuthorRow, ActionBar }
