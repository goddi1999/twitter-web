import { CloudOff, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { cn } from '@/lib/utils'

type FeedErrorProps = {
  message: string
  onRetry: () => void
  className?: string
}

export function FeedError({ message, onRetry, className }: FeedErrorProps) {
  return (
    <Empty className={cn('mx-auto max-w-xl border', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CloudOff />
        </EmptyMedia>
        <EmptyTitle>Couldn’t load posts</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button type="button" size="lg" className="h-11 w-full rounded-full" onClick={onRetry}>
          <RefreshCw />
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  )
}
