import { Monitor, Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/theme-provider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

type ThemeSwitcherProps = {
  className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-muted-foreground px-1 text-xs font-medium tracking-wide uppercase">
        Theme
      </p>
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        spacing={0}
        value={theme}
        onValueChange={(value) => {
          if (value === 'light' || value === 'dark' || value === 'system') {
            setTheme(value)
          }
        }}
        className="w-full"
        aria-label="Color theme"
      >
        <ToggleGroupItem value="light" aria-label="Light" className="flex-1 gap-1.5">
          <Sun className="size-4" />
          Light
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark" className="flex-1 gap-1.5">
          <Moon className="size-4" />
          Dark
        </ToggleGroupItem>
        <ToggleGroupItem value="system" aria-label="System" className="flex-1 gap-1.5">
          <Monitor className="size-4" />
          System
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
