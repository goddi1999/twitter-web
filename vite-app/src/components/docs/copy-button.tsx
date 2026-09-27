import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DocsCopyButtonProps = {
  value: string
  label?: string
  className?: string
}

export function DocsCopyButton({ value, label, className }: DocsCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        'size-8 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground',
        className,
      )}
      onClick={() => void copy()}
      aria-label={
        copied
          ? `Copied ${label ?? value}`
          : `Copy ${label ?? value}`
      }
    >
      {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
    </Button>
  )
}
