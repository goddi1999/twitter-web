import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type DemoPageAlign = 'start' | 'center'

type DemoPageProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: DemoPageAlign
  children: ReactNode
  className?: string
}

export function DemoPage({
  eyebrow,
  title,
  description,
  align = 'center',
  children,
  className,
}: DemoPageProps) {
  return (
    <div
      className={cn(
        'mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-8 px-6 py-10',
        align === 'center' && 'items-center text-center',
        align === 'start' && 'items-start text-left',
        className,
      )}
    >
      <header className="flex max-w-2xl flex-col gap-2">
        {eyebrow ? (
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        ) : null}
      </header>
      <div className="w-full flex-1">{children}</div>
    </div>
  )
}
