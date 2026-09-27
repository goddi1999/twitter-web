import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ThemeModeToggleVariant = 'default' | 'auth'

type ThemeModeToggleProps = {
  variant?: ThemeModeToggleVariant
  className?: string
}

function useResolvedDark(): boolean {
  const { theme } = useTheme()
  if (theme === 'dark') return true
  if (theme === 'light') return false
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeModeToggle({ variant = 'default', className }: ThemeModeToggleProps) {
  const { setTheme } = useTheme()
  const isDark = useResolvedDark()

  const handleToggleMode = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const isAuthVariant = variant === 'auth'

  return (
    <Button
      type="button"
      variant={isAuthVariant ? 'outline' : 'ghost'}
      size="icon"
      onClick={handleToggleMode}
      className={cn(
        'h-10 w-10 rounded-full',
        isAuthVariant
          ? 'shrink-0 border-border bg-card p-0 text-muted-foreground shadow-sm hover:bg-accent hover:text-foreground'
          : 'bg-background/80 text-muted-foreground shadow-sm backdrop-blur-sm hover:bg-accent hover:text-foreground',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </Button>
  )
}
