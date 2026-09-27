import { ACCENT_COLORS, type AccentId } from '@/components/themes'
import { useAccentTheme } from '@/components/use-accent-theme'
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

/** Accent swatches only — light/dark lives on the top ThemeModeToggle. */
export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { accent, setAccent } = useAccentTheme()

  return (
    <div className={cn('space-y-2', className)}>
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
  )
}
