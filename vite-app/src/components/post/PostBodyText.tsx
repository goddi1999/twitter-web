import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

const CLAMP_LINES = 4

type PostBodyTextProps = {
  text: string
  expanded: boolean
  onOverflowChange?: (canExpand: boolean) => void
  className?: string
}

export function PostBodyText({
  text,
  expanded,
  onOverflowChange,
  className,
}: PostBodyTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const node = textRef.current
    if (!node) return

    function measure() {
      if (!node) return
      if (expanded) {
        onOverflowChange?.(true)
        return
      }
      onOverflowChange?.(node.scrollHeight > node.clientHeight + 1)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [text, expanded, onOverflowChange])

  return (
    <p
      ref={textRef}
      className={cn(
        'mt-2 whitespace-pre-wrap text-[15px] leading-snug text-foreground',
        !expanded && 'line-clamp-4',
        className,
      )}
      style={!expanded ? { WebkitLineClamp: CLAMP_LINES } : undefined}
    >
      {text}
    </p>
  )
}
