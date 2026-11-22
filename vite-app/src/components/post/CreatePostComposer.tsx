import { useId, useState, type FormEvent } from 'react'
import {
  getAvatarUrls,
  getRandomAvatar,
  withImageUrl,
  type MemojiWithImageUrl,
} from '@wq-org/avatars'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { authorFromMemoji, publishPost } from './post.api'
import { MAX_TEXT_LENGTH, Post } from './post.model'

const ALL_AVATARS = getAvatarUrls()

function createRandomSelection(): MemojiWithImageUrl {
  return withImageUrl(getRandomAvatar())
}

type CreatePostComposerProps = {
  onPublished?: (post: Post) => void
  className?: string
}

export function CreatePostComposer({ onPublished, className }: CreatePostComposerProps) {
  const [avatar, setAvatar] = useState(createRandomSelection)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const author = authorFromMemoji(avatar)
  const trimmed = text.trim()
  const isOverLimit = trimmed.length > MAX_TEXT_LENGTH
  const canPost = trimmed.length > 0 && !isOverLimit && !isSubmitting
  const fieldId = useId()
  const errorMessage =
    error ??
    (isOverLimit ? `Too long — remove ${trimmed.length - MAX_TEXT_LENGTH} characters.` : null)
  const initials = author.displayName.slice(0, 2).toUpperCase()

  function selectAvatar(next: MemojiWithImageUrl) {
    setAvatar(next)
    setPickerOpen(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void handlePublish()
  }

  async function handlePublish() {
    if (!canPost) return
    setIsSubmitting(true)
    setError(null)

    let post: Post
    try {
      post = new Post(trimmed, author, new Date(), { id: crypto.randomUUID() })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid post')
      setIsSubmitting(false)
      return
    }

    try {
      await publishPost(post, avatar.id)

      setText('')
      onPublished?.(post)
    } catch (err) {
      // Plain Vite has no /api — treat network failure as local-only publish.
      if (err instanceof TypeError) {
        setText('')
        onPublished?.(post)
        return
      }
      setError(err instanceof Error ? err.message : 'Could not publish')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'w-full max-w-xl rounded-2xl border border-border/60 bg-card/40 p-4 text-left',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="grid size-11 shrink-0 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label={`Choose avatar (${author.displayName})`}
            >
              <Avatar size="tile" className="cursor-pointer transition-opacity hover:opacity-80">
                <AvatarImage src={author.avatarUrl} alt={author.displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
            <SheetHeader className="border-b border-border/60 px-4 py-4 text-left">
              <SheetTitle>Choose avatar</SheetTitle>
              <SheetDescription>
                Pick a memoji. We’ll use its name for your display name and handle.
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {ALL_AVATARS.map((item) => {
                  const selected = item.id === avatar.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectAvatar(item)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-xl p-2 text-center transition-colors',
                        'hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                        selected && 'bg-sky-500/10 ring-2 ring-sky-500'
                      )}
                      aria-pressed={selected}
                      aria-label={item.name}
                    >
                      <img
                        src={item.imageUrl}
                        alt=""
                        width={64}
                        height={64}
                        className="size-14 rounded-full bg-muted object-cover"
                      />
                      <span className="line-clamp-1 w-full text-xs font-medium text-foreground">
                        {item.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-foreground">{author.displayName}</p>
          <p className="truncate text-sm text-muted-foreground">@{author.handle}</p>
        </div>
      </div>

      <label htmlFor={fieldId} className="mt-4 mb-2 block text-sm font-medium text-foreground">
        What&apos;s happening?
      </label>
      <textarea
        id={fieldId}
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={2}
        placeholder="Share a thought…"
        aria-invalid={isOverLimit || error !== null}
        aria-describedby={`${fieldId}-hint`}
        className={cn(
          'block min-h-20 w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-lg leading-relaxed text-foreground',
          'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
          isOverLimit &&
            'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20'
        )}
      />

      <div id={`${fieldId}-hint`}>
        {errorMessage ? (
          <p role="alert" className="mt-1.5 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span
          aria-live="polite"
          className={cn(
            'text-sm text-muted-foreground tabular-nums',
            isOverLimit && 'text-destructive'
          )}
        >
          {trimmed.length} / {MAX_TEXT_LENGTH}
        </span>
        <Button type="submit" disabled={!canPost} className="h-11 rounded-full px-8">
          {isSubmitting ? 'Posting…' : 'Post'}
        </Button>
      </div>
    </form>
  )
}
