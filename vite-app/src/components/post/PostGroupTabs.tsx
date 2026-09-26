import { UserRoundGroup } from 'lucide-react'

import { BlurredImage } from '@/components/ui/blurred-image'
import { BlurredScrollArea } from '@/components/ui/blurred-scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { Post } from './post.model'

type PostGroupTabsProps = {
  posts: Post[]
  /** `null` = show all groups */
  activePostId: string | null
  onSelect: (postId: string | null) => void
  className?: string
}

export function PostGroupTabs({
  posts,
  activePostId,
  onSelect,
  className,
}: PostGroupTabsProps) {
  return (
    <BlurredScrollArea
      orientation="horizontal"
      scrollbars="horizontal"
      hideHorizontalScrollBar
      className={cn('w-full', className)}
      viewportClassName="w-full"
    >
      <div className="flex w-max items-stretch gap-2 px-0.5 py-1">
        <Button
          type="button"
          variant={activePostId === null ? 'secondary' : 'ghost'}
          size="sm"
          className="h-auto shrink-0 flex-col gap-1 rounded-xl px-3 py-2"
          onClick={() => onSelect(null)}
          aria-pressed={activePostId === null}
        >
          <UserRoundGroup className="size-5 text-muted-foreground" />
          <span className="text-[10px] font-medium text-muted-foreground">All</span>
        </Button>

        {posts.map((post) => {
          const author = post.getAuthor()
          const selected = activePostId === post.id

          return (
            <Button
              key={post.id}
              type="button"
              variant={selected ? 'secondary' : 'ghost'}
              size="sm"
              className="h-auto w-16 shrink-0 flex-col gap-1 rounded-xl px-2 py-2"
              onClick={() => onSelect(post.id)}
              aria-pressed={selected}
              title={post.id}
            >
              <span className="relative size-8 overflow-hidden rounded-full">
                <BlurredImage
                  src={author.avatarUrl}
                  alt={author.displayName}
                  variant="avatar"
                  isBlurred
                  className="size-8"
                />
              </span>
              <span className="w-full line-clamp-1 break-all font-mono text-[10px] text-muted-foreground">
                {post.id}
              </span>
            </Button>
          )
        })}
      </div>
    </BlurredScrollArea>
  )
}
