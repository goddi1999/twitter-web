import { getAvatarUrls } from '@wq-org/avatars'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

import { DocsCopyButton } from './copy-button'

const AVATARS = getAvatarUrls()
const WQ_AVATARS_REPO = 'https://github.com/wq-org/wq-avatars'

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
        <TableCaption className="px-4 pb-4 text-left text-muted-foreground">
          All memojis from{' '}
          <a
            href={WQ_AVATARS_REPO}
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline underline-offset-2 hover:opacity-80"
          >
            @wq-org/avatars
          </a>{' '}
          (
          <a
            href={WQ_AVATARS_REPO}
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline underline-offset-2 hover:opacity-80"
          >
            github.com/wq-org/wq-avatars
          </a>
          ). Send <code className="text-foreground">avatarId</code> on publish — the server
          resolves name, handle, and image URL.
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
                    <DocsCopyButton value={avatar.id} label={avatar.id} />
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
