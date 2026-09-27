import { Monitor, Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/theme-provider'
import { ACCENT_COLORS, type AccentId } from '@/components/themes'
import { useAccentTheme } from '@/components/use-accent-theme'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

type ThemeSwitcherProps = {
  className?: string
}

const ACCENT_OPTIONS: { id: AccentId; label: string; oklch?: string }[] = [
  { id: 'default', label: 'Default' },
  ...ACCENT_COLORS.map((color) => ({
    id: color.id as AccentId,
    label: color.label,
    oklch: color.oklch,
  })),
]

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()
  const { accent, setAccent } = useAccentTheme()

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <p className="text-muted-foreground px-1 text-xs font-medium tracking-wide uppercase">
          Mode
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
          aria-label="Color mode"
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

      <div className="space-y-2">
        <p className="text-muted-foreground px-1 text-xs font-medium tracking-wide uppercase">
          Accent
        </p>
        <div className="grid grid-cols-5 gap-2 px-1" role="listbox" aria-label="Accent color">
          {ACCENT_OPTIONS.map((option) => {
            const selected = accent === option.id
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={selected}
                aria-label={option.label}
                title={option.label}
                onClick={() => setAccent(option.id)}
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border transition-shadow',
                  selected
                    ? 'border-foreground ring-2 ring-ring ring-offset-2 ring-offset-background'
                    : 'border-border/60 hover:border-foreground/40',
                )}
              >
                <span
                  className={cn(
                    'size-5 rounded-full',
                    option.id === 'default' && 'bg-foreground',
                  )}
                  style={
                    option.oklch
                      ? { backgroundColor: `oklch(${option.oklch})` }
                      : undefined
                  }
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
