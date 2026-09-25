import { ArrowLeft, BadgeCheck, Heart, MessageCircle } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BlurredScrollArea } from '@/components/ui/blurred-scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { formatRelativeTime } from './format-relative-time'
import type { Comment, Post } from './post.model'

type PostThreadProps = {
  post: Post
  onBack: () => void
  onLike: (post: Post) => void
  className?: string
}

function CommentRow({
  comment,
  replyHandle,
}: {
  comment: Comment
  replyHandle: string
}) {
  const author = comment.getAuthor()
  const createdAt = comment.getCreatedAt()
  const initials = author.displayName.slice(0, 2).toUpperCase()

  return (
    <article className="relative flex gap-3 px-4 py-3">
      <div className="flex flex-col items-center">
        <Avatar size="sm">
          <AvatarImage src={author.avatarUrl} alt={author.displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-1 text-sm leading-tight">
          <span className="font-semibold text-foreground">{author.displayName}</span>
          <BadgeCheck
            className="size-4 shrink-0 fill-sky-500 text-sky-500"
            aria-label="Verified"
          />
          <span className="text-muted-foreground">@{author.handle}</span>
          <span className="text-muted-foreground">·</span>
          <time className="text-muted-foreground" dateTime={createdAt.toISOString()}>
            {formatRelativeTime(createdAt)}
          </time>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Replying to <span className="text-sky-500">@{replyHandle}</span>
        </p>
        <p className="mt-1 whitespace-pre-wrap text-[15px] leading-snug text-foreground">
          {comment.getText()}
        </p>
      </div>
    </article>
  )
}

export function PostThread({ post, onBack, onLike, className }: PostThreadProps) {
  const author = post.getAuthor()
  const createdAt = post.getCreatedAt()
  const comments = post.getComments()
  const initials = author.displayName.slice(0, 2).toUpperCase()
  const likeCount = post.getLikeCount()

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <header className="flex shrink-0 items-center gap-2 border-b border-border/60 px-2 py-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Back"
          onClick={onBack}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h2 className="text-base font-semibold text-foreground">Thread</h2>
      </header>

      <BlurredScrollArea className="min-h-0 flex-1" hideScrollBar>
        <div className="relative px-4 pt-4 pb-2">
          {/* Thread spine behind avatars */}
          {comments.length > 0 ? (
            <div
              aria-hidden
              className="absolute top-14 bottom-0 left-[1.875rem] w-px bg-border"
            />
          ) : null}

          <div className="relative flex gap-3">
            <Avatar size="default" className="relative z-10 bg-background">
              <AvatarImage src={author.avatarUrl} alt={author.displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-1 text-sm leading-tight">
                <span className="font-semibold text-foreground">{author.displayName}</span>
                <BadgeCheck
                  className="size-4 shrink-0 fill-sky-500 text-sky-500"
                  aria-label="Verified"
                />
              </div>
              <p className="text-sm text-muted-foreground">@{author.handle}</p>
            </div>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-[17px] leading-relaxed text-foreground">
            {post.getText()}
          </p>

          <div className="mt-3 flex flex-nowrap items-center gap-3 overflow-x-auto text-sm text-muted-foreground">
            <time className="shrink-0 whitespace-nowrap" dateTime={createdAt.toISOString()}>
              {formatRelativeTime(createdAt)}
            </time>
            <span className="shrink-0 text-border" aria-hidden>
              ·
            </span>
            <p className="shrink-0 whitespace-nowrap">
              <span className="font-semibold text-foreground">{likeCount}</span> Likes
            </p>
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-muted-foreground"
                aria-label={`${comments.length} comments`}
              >
                <MessageCircle className="size-4" />
                <span>{comments.length}</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-muted-foreground"
                onClick={() => onLike(post)}
                aria-label={`Like, ${likeCount} likes`}
              >
                <Heart className="size-4" />
                <span>{likeCount}</span>
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="relative pb-8">
          {comments.length > 0 ? (
            <div
              aria-hidden
              className="absolute top-0 bottom-8 left-[1.875rem] w-px bg-border"
            />
          ) : null}
          {comments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              replyHandle={author.handle}
            />
          ))}
          {comments.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No comments yet.
            </p>
          ) : null}
        </div>
      </BlurredScrollArea>
    </div>
  )
}
