import { useRef } from 'react'
import { ArrowLeft, MessageCircle } from 'lucide-react'

import { ActivityTimeline, type ActivityTimelineEvent } from '@/components/ui/activity-timeline'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BlurredScrollArea } from '@/components/ui/blurred-scroll-area'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useNow } from '@/hooks'
import { cn } from '@/lib/utils'

import { formatRelativeTime } from './format-relative-time'
import { PostActions } from './PostActions'
import type { Comment, Post } from './post.model'

const COMMENT_UNIT = { one: 'comment', other: 'comments' } as const

type PostThreadProps = {
  post: Post
  onBack: () => void
  onLike: (post: Post) => void
  className?: string
}

function toTimelineEvent(comment: Comment): ActivityTimelineEvent {
  const author = comment.getAuthor()
  return {
    id: comment.id,
    at: comment.getCreatedAt().getTime(),
    actor: author.displayName,
    title: comment.getText(),
    meta: <span className="text-sky-500">@{author.handle}</span>,
    avatar: author.avatarUrl,
  }
}

export function PostThread({ post, onBack, onLike, className }: PostThreadProps) {
  const now = useNow()
  const repliesRef = useRef<HTMLElement>(null)
  const author = post.getAuthor()
  const createdAt = post.getCreatedAt()
  const comments = post.getComments()
  const imageUrl = post.getImageUrl()
  const initials = author.displayName.slice(0, 2).toUpperCase()
  const events = comments.map(toTimelineEvent)

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <header className="flex shrink-0 items-center gap-3 border-b border-border/60 px-2 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Back to feed"
          onClick={onBack}
          className="size-11 rounded-full bg-muted text-muted-foreground ring-1 ring-border hover:bg-muted hover:text-foreground dark:ring-0"
        >
          <ArrowLeft className="size-[22px]" />
        </Button>
        <h2 className="text-base font-semibold text-foreground">Thread</h2>
      </header>

      <BlurredScrollArea className="min-h-0 flex-1" hideScrollBar>
        <article className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar size="default">
              <AvatarImage src={author.avatarUrl} alt={author.displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-foreground">{author.displayName}</p>
              <p className="truncate text-sm text-sky-500">@{author.handle}</p>
            </div>
          </div>

          <p className="mt-3 text-[17px] leading-relaxed whitespace-pre-wrap text-foreground">
            {post.getText()}
          </p>

          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="mt-3 max-h-[28rem] w-full rounded-xl border border-border/60 object-cover"
            />
          ) : null}

          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={createdAt.toISOString()}>{formatRelativeTime(createdAt)}</time>
            <PostActions
              className="ml-auto"
              commentCount={comments.length}
              likeCount={post.getLikeCount()}
              onComment={() =>
                repliesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              onLike={() => onLike(post)}
            />
          </div>
        </article>

        <section
          ref={repliesRef}
          aria-labelledby="thread-replies"
          className="scroll-mt-2 border-t border-border/60 px-4 pt-4 pb-8"
        >
          <h3 id="thread-replies" className="text-sm text-muted-foreground">
            Replying to <span className="text-sky-500">@{author.handle}</span>
          </h3>

          {events.length > 0 ? (
            <ActivityTimeline
              events={events}
              now={now}
              label={`Comments on ${author.displayName}’s post`}
              timeZone="Europe/Berlin"
              locale="en-GB"
              unit={COMMENT_UNIT}
              headingLevel={4}
              className="mt-2 [--timeline-surface:var(--background)]"
            />
          ) : (
            <Empty className="mt-4 border p-6 md:p-6">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageCircle />
                </EmptyMedia>
                <EmptyTitle>No comments yet</EmptyTitle>
                <EmptyDescription>Replies to this post show up here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </section>
      </BlurredScrollArea>
    </div>
  )
}
