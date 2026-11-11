import { BookOpen, House, SquarePen, Terminal, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type AppView = 'home' | 'create' | 'docs' | 'useful-commands'

const NAV_ITEMS: { id: AppView; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'create', label: 'Create post', icon: SquarePen },
  { id: 'docs', label: 'API docs', icon: BookOpen },
  { id: 'useful-commands', label: 'Useful commands', icon: Terminal },
]

type AppNavProps = {
  view: AppView
  onNavigate: (view: AppView) => void
  className?: string
}

export function AppNav({ view, onNavigate, className }: AppNavProps) {
  return (
    <nav aria-label="Main" className={cn('flex flex-wrap justify-center gap-2', className)}>
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          type="button"
          variant={view === id ? 'secondary' : 'ghost'}
          size="sm"
          className="rounded-full"
          aria-current={view === id ? 'page' : undefined}
          onClick={() => onNavigate(id)}
        >
          <Icon />
          {label}
        </Button>
      ))}
    </nav>
  )
}
