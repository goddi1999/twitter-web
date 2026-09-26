import { useState } from 'react'
import { BadgeCheck, MessageCircle } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PulseHeart } from '@/components/pulse-heart'
import { cn } from '@/lib/utils'

import { formatRelativeTime } from './format-relative-time'
import { PostBodyText } from './PostBodyText'
import type { Post } from './post.model'
import type { Author } from './post.types'

/** Fixed card width for the feed grid. */
export const POST_CARD_WIDTH_CLASS = 'w-[18.75rem]'

type PostCardProps = {
  post: Post
  onOpen?: (post: Post) => void
  onLike?: (post: Post) => void
  /** Show verified badge when the author has more than 3 posts in the feed. */
  verified?: boolean
  className?: string
}

function AuthorRow({
  author,
  createdAt,
  verified = false,
}: {
  author: Author
  createdAt: Date
  verified?: boolean
}) {
  const initials = author.displayName.slice(0, 2).toUpperCase()

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar size="sm" className="shrink-0">
        <AvatarImage src={author.avatarUrl} alt={author.displayName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 items-center gap-x-1 text-sm leading-none">
        <span className="truncate font-semibold text-foreground">{author.displayName}</span>
        {verified ? (
          <BadgeCheck
            className="size-4 shrink-0 fill-sky-500 text-sky-500"
            aria-label="Verified"
          />
        ) : null}
        <span className="truncate text-muted-foreground">@{author.handle}</span>
        <span className="shrink-0 text-muted-foreground">·</span>
        <time
          className="shrink-0 text-muted-foreground"
          dateTime={createdAt.toISOString()}
        >
          {formatRelativeTime(createdAt)}
        </time>
      </div>
    </div>
  )
}

export function PostCard({
  post,
  onOpen,
  onLike,
  verified = false,
  className,
}: PostCardProps) {
  const author = post.getAuthor()
  const createdAt = post.getCreatedAt()
  const [expanded, setExpanded] = useState(false)
  const [canExpand, setCanExpand] = useState(false)
  const commentCount = post.getComments().length
  const likeCount = post.getLikeCount()

  return (
    <Card
      layout="flush"
      variant="soft"
      role="article"
      tabIndex={onOpen ? 0 : undefined}
      className={cn(
        POST_CARD_WIDTH_CLASS,
        'shrink-0 cursor-pointer rounded-xl border border-border/60 bg-card/40 py-3 shadow-none',
        'transition-colors hover:bg-muted/40',
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
      <CardContent className="flex h-full flex-col px-4">
        <AuthorRow author={author} createdAt={createdAt} verified={verified} />
        <PostBodyText
          text={post.getText()}
          expanded={expanded}
          onOverflowChange={setCanExpand}
        />
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-muted-foreground transition-colors hover:text-sky-500"
              onClick={(event) => {
                event.stopPropagation()
                onOpen?.(post)
              }}
              aria-label={`${commentCount} comments`}
            >
              <MessageCircle className="size-4" />
              <span>{commentCount}</span>
            </Button>
            <div
              className="flex items-center"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <PulseHeart
                count={likeCount}
                size={18}
                likedColor="#ef4444"
                idleColor="oklch(0.55 0 0)"
                pillColor="transparent"
                textColor="currentColor"
                className="text-muted-foreground"
                label="Like"
                onChange={(liked) => {
                  if (liked) onLike?.(post)
                }}
              />
            </div>
          </div>
          {canExpand ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 shrink-0 px-2 text-muted-foreground"
              onClick={(event) => {
                event.stopPropagation()
                setExpanded((current) => !current)
              }}
            >
              {expanded ? 'Show less' : 'Expand'}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
