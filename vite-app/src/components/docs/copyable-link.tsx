import { cn } from '@/lib/utils'

import { DocsCopyButton } from './copy-button'

type DocsCopyableLinkProps = {
  label: string
  value: string
  href?: string
  className?: string
}

export function DocsCopyableLink({
  label,
  value,
  href,
  className,
}: DocsCopyableLinkProps) {
  const linkHref = href ?? (value.startsWith('http') ? value : undefined)

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/40 px-3 py-2',
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {linkHref ? (
          <a
            href={linkHref}
            target="_blank"
            rel="noreferrer"
            className="block truncate font-mono text-sm text-foreground underline-offset-2 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="truncate font-mono text-sm text-foreground">{value}</p>
        )}
      </div>
      <DocsCopyButton value={value} label={label} />
    </div>
  )
}
