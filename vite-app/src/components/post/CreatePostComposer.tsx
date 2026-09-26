import { useState } from 'react'
import { getRandomAvatar, withImageUrl } from '@wq-org/avatars'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { FieldTextarea } from '@/components/ui/field-textarea'
import { cn } from '@/lib/utils'

import { MAX_TEXT_LENGTH, Post } from './post.model'
import type { Author } from './post.types'

function createRandomAuthor(): Author {
  const avatar = withImageUrl(getRandomAvatar())
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

type CreatePostComposerProps = {
  onPublished?: (post: Post) => void
  className?: string
}

export function CreatePostComposer({ onPublished, className }: CreatePostComposerProps) {
  const [author] = useState(createRandomAuthor)
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmed = text.trim()
  const canPost = trimmed.length > 0 && trimmed.length <= MAX_TEXT_LENGTH && !isSubmitting
  const initials = author.displayName.slice(0, 2).toUpperCase()

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
      <div className="flex gap-3">
        <Avatar size="default" className="mt-1 shrink-0">
          <AvatarImage src={author.avatarUrl} alt={author.displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
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
