import type { ReactNode } from 'react'
import { ArrowLeft, BookOpen, House, RefreshCw, SquarePen } from 'lucide-react'

import { ThemeModeToggle } from '@/components/ThemeModeToggle'
import { Button } from '@/components/ui/button'
import { RubberDock, type RubberDockItem } from '@/components/ui/rubber-dock'
import { cn } from '@/lib/utils'

export type AppView = 'home' | 'create' | 'docs'

const DOCK_ITEMS = [
  { value: 'home', label: 'For You', icon: <House /> },
  { value: 'create', label: 'Create post', icon: <SquarePen /> },
  { value: 'docs', label: 'API docs', icon: <BookOpen /> },
] as const satisfies readonly (RubberDockItem & { value: AppView })[]

function isAppView(value: string): value is AppView {
  return DOCK_ITEMS.some((item) => item.value === value)
}

/** Same material as the dock surface: muted fill, hairline ring in light mode, no shadow. */
const ACTION_GROUP =
  'flex shrink-0 items-center gap-0.5 rounded-full bg-muted p-1 ring-1 ring-border dark:ring-0'

const ACTION_BUTTON =
  'size-11 rounded-full bg-transparent text-muted-foreground shadow-none backdrop-blur-none hover:bg-background hover:text-foreground'

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={onClick}
      className={ACTION_BUTTON}
    >
      {children}
    </Button>
  )
}

type AppNavProps = {
  view: AppView
  onNavigate: (view: AppView) => void
  onBack: () => void
  onRefresh: () => void
  refreshing: boolean
  className?: string
}

/** Sticky top bar: Back · rubber dock with the views · Refresh + theme. */
export function AppNav({
  view,
  onNavigate,
  onBack,
  onRefresh,
  refreshing,
  className,
}: AppNavProps) {
  function handleValueChange(next: string) {
    if (isAppView(next)) onNavigate(next)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-background/80 px-3 py-2 backdrop-blur-md',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-1.5 sm:gap-3">
        <div className={ACTION_GROUP}>
          <ActionButton label="Back to courses" onClick={onBack}>
            <ArrowLeft className="size-[22px]" />
          </ActionButton>
        </div>

        <RubberDock
          aria-label="Main"
          items={DOCK_ITEMS}
          value={view}
          onValueChange={handleValueChange}
        />

        <div className={ACTION_GROUP}>
          <ActionButton label="Refresh posts" onClick={onRefresh}>
            <RefreshCw className={cn('size-[22px]', refreshing && 'animate-spin')} />
          </ActionButton>
          <ThemeModeToggle className={ACTION_BUTTON} />
        </div>
      </div>
    </header>
  )
}
