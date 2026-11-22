import { EyeOff, Heart, MessageCircle } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

import { FeedError } from './FeedError'
import { formatRelativeTime } from './format-relative-time'
import { PostAdminMenu } from './PostAdminMenu'
import type { ModerationAction } from './post.api'
import type { Post } from './post.model'
import type { UseFeed } from './use-feed'

type AdminPostRowProps = {
  post: Post
  hidden: boolean
  onModerate: (post: Post, action: ModerationAction) => Promise<void>
}

function AdminPostRow({ post, hidden, onModerate }: AdminPostRowProps) {
  const author = post.getAuthor()
  const createdAt = post.getCreatedAt()

  return (
    <li className="flex gap-3 py-3">
      <Avatar size="sm" className={cn('mt-0.5 shrink-0', hidden && 'opacity-50')}>
        <AvatarImage src={author.avatarUrl} alt={author.displayName} />
        <AvatarFallback>{author.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-x-1 text-sm leading-tight">
          <span className="truncate font-semibold text-foreground">{author.displayName}</span>
          <span className="truncate text-sky-500">@{author.handle}</span>
          <span className="shrink-0 text-muted-foreground">·</span>
          <time className="shrink-0 text-muted-foreground" dateTime={createdAt.toISOString()}>
            {formatRelativeTime(createdAt)}
          </time>
        </div>
        <p
          className={cn(
            'mt-1 line-clamp-2 text-sm break-words text-foreground',
            hidden && 'text-muted-foreground'
          )}
        >
          {post.getText()}
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
          {hidden ? (
            <span className="flex items-center gap-1 font-medium">
              <EyeOff className="size-3.5" aria-hidden />
              Hidden
            </span>
          ) : null}
          <span
            className="flex items-center gap-1"
            aria-label={`${post.getComments().length} comments`}
          >
            <MessageCircle className="size-3.5" aria-hidden />
            {post.getComments().length}
          </span>
          <span className="flex items-center gap-1" aria-label={`${post.getLikeCount()} likes`}>
            <Heart className="size-3.5" aria-hidden />
            {post.getLikeCount()}
          </span>
        </div>
      </div>

      <PostAdminMenu
        authorName={author.displayName}
        hidden={hidden}
        onModerate={(action) => onModerate(post, action)}
        className="-mt-1.5 -mr-2 shrink-0"
      />
    </li>
  )
}

type AdminPostListProps = {
  feed: UseFeed
  className?: string
}

/** Every post (hidden ones included) with its ⋯ menu — the admin's manage view. */
export function AdminPostList({ feed, className }: AdminPostListProps) {
  const { state, reload, moderate } = feed

  return (
    <section
      aria-labelledby="admin-all-posts"
      className={cn('w-full max-w-xl text-left', className)}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="admin-all-posts" className="text-base font-semibold text-foreground">
          All posts
        </h2>
        {state.status === 'ready' ? (
          <span className="text-sm text-muted-foreground tabular-nums">
            {state.feed.posts.length} {state.feed.posts.length === 1 ? 'post' : 'posts'}
            {state.feed.hiddenIds.size > 0 ? ` · ${state.feed.hiddenIds.size} hidden` : ''}
          </span>
        ) : null}
      </div>

      {state.status === 'loading' ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading posts…</p>
      ) : state.status === 'error' ? (
        <FeedError message={state.message} onRetry={reload} className="mt-3" />
      ) : state.feed.posts.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <ul className="mt-1 divide-y divide-border/60">
          {state.feed.posts.map((post) =>
            moderate ? (
              <AdminPostRow
                key={post.id}
                post={post}
                hidden={state.feed.hiddenIds.has(post.id)}
                onModerate={moderate}
              />
            ) : null
          )}
        </ul>
      )}
    </section>
  )
}
