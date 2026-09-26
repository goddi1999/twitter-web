import { useState } from 'react'
import {
  getAvatarUrls,
  getRandomAvatar,
  withImageUrl,
  type MemojiWithImageUrl,
} from '@wq-org/avatars'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { FieldTextarea } from '@/components/ui/field-textarea'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { MAX_TEXT_LENGTH, Post } from './post.model'
import type { Author } from './post.types'

const ALL_AVATARS = getAvatarUrls()

function authorFromMemoji(avatar: MemojiWithImageUrl): Author {
  const handle = avatar.name.toLowerCase().replace(/[^a-z0-9]+/g, '')
  if (!handle) {
    throw new Error(`Could not derive handle from avatar name: ${avatar.name}`)
  }
  return {
    displayName: avatar.name,
    handle,
    avatarUrl: avatar.imageUrl,
  }
}

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
  const canPost = trimmed.length > 0 && trimmed.length <= MAX_TEXT_LENGTH && !isSubmitting
  const initials = author.displayName.slice(0, 2).toUpperCase()

  function selectAvatar(next: MemojiWithImageUrl) {
    setAvatar(next)
    setPickerOpen(false)
  }

  async function handlePublish() {
    if (!canPost) return
    setIsSubmitting(true)
    setError(null)

    let post: Post
    try {
      post = new Post(trimmed, author)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid post')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: {
            id: post.id,
            text: post.getText(),
            likeCount: post.getLikeCount(),
            comments: [],
            createdAt: post.getCreatedAt().toISOString(),
            avatarId: avatar.id,
          },
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(payload?.error ?? `Publish failed (${response.status})`)
      }

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
    <div
      className={cn(
        'w-full max-w-xl rounded-2xl border border-border/60 bg-card/40 p-4 text-left shadow-none',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Choose avatar (${author.displayName})`}
            >
              <Avatar
                size="default"
                className="cursor-pointer ring-offset-background transition-opacity hover:opacity-80"
              >
                <AvatarImage src={author.avatarUrl} alt={author.displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
          >
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
                        'hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        selected && 'bg-sky-500/10 ring-2 ring-sky-500',
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

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-sm font-semibold text-foreground">
            {author.displayName}{' '}
            <span className="font-normal text-muted-foreground">@{author.handle}</span>
          </p>
          <FieldTextarea
            label="Post"
            placeholder="What's happening?"
            value={text}
            onValueChange={setText}
            maxLength={MAX_TEXT_LENGTH}
            rows={4}
            hideSeparator
            showCounter
            className="pb-0 [&_label]:sr-only [&_textarea]:min-h-28 [&_textarea]:text-xl [&_textarea]:leading-relaxed"
          />

          <div className="mt-3 flex items-center justify-end gap-3 border-t border-border/60 pt-3">
            {error ? (
              <p className="mr-auto text-sm text-destructive">{error}</p>
            ) : null}
            <Button
              type="button"
              disabled={!canPost}
              onClick={() => void handlePublish()}
              className="rounded-full px-5"
            >
              {isSubmitting ? 'Posting…' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
