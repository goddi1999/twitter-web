import { useState, type ReactNode, type SyntheticEvent } from 'react'
import { Ellipsis, Eye, EyeOff, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import type { ModerationAction } from './post.api'

type PostAdminMenuProps = {
  /** Shown in the delete confirmation, e.g. "Sophie". */
  authorName: string
  hidden: boolean
  onModerate: (action: ModerationAction) => Promise<void>
  className?: string
}

function MenuItem({
  icon,
  children,
  destructive = false,
  disabled = false,
  onSelect,
}: {
  icon: ReactNode
  children: ReactNode
  destructive?: boolean
  disabled?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium outline-none',
        'hover:bg-muted focus-visible:bg-muted disabled:opacity-50 [&_svg]:size-4',
        destructive ? 'text-destructive' : 'text-foreground'
      )}
    >
      {icon}
      {children}
    </button>
  )
}

/** Admin ⋯ menu on a post: hide/unhide in a popover, delete confirmed in a drawer. */
export function PostAdminMenu({ authorName, hidden, onModerate, className }: PostAdminMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pending, setPending] = useState<ModerationAction | null>(null)
  const [error, setError] = useState<string | null>(null)

  // clicks inside the menu, drawer (portals bubble through React) must not open the card
  const stop = (event: SyntheticEvent) => event.stopPropagation()

  async function run(action: ModerationAction) {
    setPending(action)
    setError(null)
    try {
      await onModerate(action)
      setMenuOpen(false)
      setConfirmOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the post.')
    } finally {
      setPending(null)
    }
  }

  function openConfirm() {
    setError(null)
    setMenuOpen(false)
    setConfirmOpen(true)
  }

  return (
    <div className={className} onClick={stop} onKeyDown={stop}>
      <Popover
        open={menuOpen}
        onOpenChange={(open) => {
          setMenuOpen(open)
          if (!open) setError(null)
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Manage post"
            className="size-11 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Ellipsis className="size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56 gap-0.5 p-1.5">
          <MenuItem
            icon={hidden ? <Eye /> : <EyeOff />}
            disabled={pending !== null}
            onSelect={() => void run(hidden ? 'unhide' : 'hide')}
          >
            {pending === 'hide' || pending === 'unhide'
              ? 'Saving…'
              : hidden
                ? 'Unhide post'
                : 'Hide post'}
          </MenuItem>
          <MenuItem
            icon={<Trash2 />}
            destructive
            disabled={pending !== null}
            onSelect={openConfirm}
          >
            Delete post…
          </MenuItem>
          {error ? (
            <p role="alert" className="px-3 py-1.5 text-sm break-words text-destructive">
              {error}
            </p>
          ) : null}
        </PopoverContent>
      </Popover>

      <Drawer
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open)
          if (!open) setError(null)
        }}
      >
        <DrawerContent
          // a short confirmation, not a full-height sheet
          style={{ top: 'auto', height: 'auto' }}
          className="mx-auto w-full sm:max-w-md"
          onClick={stop}
        >
          <DrawerHeader className="text-left md:text-left">
            <DrawerTitle>Delete this post?</DrawerTitle>
            <DrawerDescription>
              {authorName}’s post disappears from the feed for everyone. You can’t undo this in the
              app.
            </DrawerDescription>
          </DrawerHeader>
          {error ? (
            <p role="alert" className="px-4 text-sm break-words text-destructive">
              {error}
            </p>
          ) : null}
          <DrawerFooter className="pb-6">
            <Button
              type="button"
              variant="destructive"
              disabled={pending !== null}
              onClick={() => void run('delete')}
              className="h-11 rounded-full"
            >
              {pending === 'delete' ? 'Deleting…' : 'Delete post'}
            </Button>
            <DrawerClose asChild>
              <Button type="button" variant="ghost" className="h-11 rounded-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
