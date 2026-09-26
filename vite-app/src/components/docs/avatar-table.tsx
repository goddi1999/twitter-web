import { useState } from 'react'
import { getAvatarUrls } from '@wq-org/avatars'
import { Check, Copy } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

const AVATARS = getAvatarUrls()

function CopyIdButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(id)
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
      className="size-8 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
      onClick={() => void copy()}
      aria-label={copied ? `Copied ${id}` : `Copy ${id}`}
    >
      {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
    </Button>
  )
}

type AvatarCatalogTableProps = {
  className?: string
}

export function AvatarCatalogTable({ className }: AvatarCatalogTableProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border/60 bg-card/40',
        className,
      )}
    >
      <Table>
        <TableCaption className="px-4 pb-4 text-muted-foreground">
          All memojis from <code className="text-foreground">@wq-org/avatars</code>. Send{' '}
          <code className="text-foreground">avatarId</code> on publish — the server resolves name,
          handle, and image URL.
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="px-4">ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {AVATARS.map((avatar) => {
            const initials = avatar.name.slice(0, 2).toUpperCase()
            return (
              <TableRow key={avatar.id}>
                <TableCell className="px-4">
                  <Avatar size="sm">
                    <AvatarImage src={avatar.imageUrl} alt={avatar.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-foreground">{avatar.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="mr-1.5" aria-hidden>
                    {avatar.flag}
                  </span>
                  {avatar.countryCode}
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex items-center gap-1">
                    <code className="font-mono text-xs text-foreground">{avatar.id}</code>
                    <CopyIdButton id={avatar.id} />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
