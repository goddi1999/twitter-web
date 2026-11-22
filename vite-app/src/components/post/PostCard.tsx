import { useState } from 'react'
import { EyeOff } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { formatRelativeTime } from './format-relative-time'
import { PostActions } from './PostActions'
import { PostAdminMenu } from './PostAdminMenu'
import { PostBodyText } from './PostBodyText'
import type { ModerationAction } from './post.api'
import type { Post } from './post.model'
import type { Author } from './post.types'

/** Fixed card width for the feed grid. */
export const POST_CARD_WIDTH_CLASS = 'w-[18.75rem]'

type PostCardProps = {
  post: Post
  onOpen?: (post: Post) => void
  onLike?: (post: Post) => void
  /** Admin only: hidden posts stay visible to the admin, dimmed and labeled. */
  hidden?: boolean
  /** Admin only: shows the ⋯ menu. */
  onModerate?: (post: Post, action: ModerationAction) => Promise<void>
  className?: string
}

function AuthorRow({ author, createdAt }: { author: Author; createdAt: Date }) {
  const initials = author.displayName.slice(0, 2).toUpperCase()

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar size="sm" className="shrink-0">
        <AvatarImage src={author.avatarUrl} alt={author.displayName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 items-center gap-x-1 text-sm leading-none">
        <span className="truncate font-semibold text-foreground">{author.displayName}</span>
        <span className="truncate text-sky-500">@{author.handle}</span>
        <span className="shrink-0 text-muted-foreground">·</span>
        <time className="shrink-0 text-muted-foreground" dateTime={createdAt.toISOString()}>
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
  hidden = false,
  onModerate,
  className,
}: PostCardProps) {
  const author = post.getAuthor()
  const createdAt = post.getCreatedAt()
  const [expanded, setExpanded] = useState(false)
  const [canExpand, setCanExpand] = useState(false)
  const commentCount = post.getComments().length
  const likeCount = post.getLikeCount()
  const imageUrl = post.getImageUrl()

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
        hidden && 'border-dashed',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
        className
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
        <div className="flex items-center gap-1">
          <AuthorRow author={author} createdAt={createdAt} />
          {onModerate ? (
            <PostAdminMenu
              authorName={author.displayName}
              hidden={hidden}
              onModerate={(action) => onModerate(post, action)}
              className="-my-2 -mr-2 ml-auto shrink-0"
            />
          ) : null}
        </div>
        {hidden ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <EyeOff className="size-3.5" aria-hidden />
            Hidden from the feed
          </p>
        ) : null}
        <div className={cn('flex flex-1 flex-col', hidden && 'opacity-50')}>
          <PostBodyText text={post.getText()} expanded={expanded} onOverflowChange={setCanExpand} />
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              loading="lazy"
              className="mt-2 aspect-video w-full rounded-lg border border-border/60 object-cover"
            />
          ) : null}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <PostActions
            commentCount={commentCount}
            likeCount={likeCount}
            onComment={() => onOpen?.(post)}
            onLike={() => onLike?.(post)}
          />
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
