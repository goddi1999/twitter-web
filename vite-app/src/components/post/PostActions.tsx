import type { SyntheticEvent } from 'react'

import { PulseHeart } from '@/components/ui/pulse-heart'
import { cn } from '@/lib/utils'

/** Shared look for both pulses: no pill, muted glyph, count in the text color. */
const PULSE_STYLE = {
  size: 20,
  idleColor: 'oklch(0.55 0 0)',
  pillColor: 'transparent',
  textColor: 'currentColor',
  className: 'text-muted-foreground',
} as const

type PostActionsProps = {
  commentCount: number
  likeCount: number
  /** Opens or scrolls to the comments; never changes the count. */
  onComment: () => void
  /** Called when the post is liked (not on unlike). */
  onLike: () => void
  className?: string
}

/** Comment + like, one component so the card and the thread match exactly. */
export function PostActions({
  commentCount,
  likeCount,
  onComment,
  onLike,
  className,
}: PostActionsProps) {
  // a press here must not also open the card it sits on
  const stop = (event: SyntheticEvent) => event.stopPropagation()

  return (
    <div className={cn('flex items-center gap-1', className)} onClick={stop} onKeyDown={stop}>
      <PulseHeart
        {...PULSE_STYLE}
        variant="action"
        icon="chat"
        color="blue"
        count={commentCount}
        label="Comments"
        onPress={onComment}
      />
      <PulseHeart
        {...PULSE_STYLE}
        icon="heart"
        color="red"
        count={likeCount}
        label="Like"
        onChange={(liked) => {
          if (liked) onLike()
        }}
      />
    </div>
  )
}
