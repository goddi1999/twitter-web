import { useEffect, useState } from 'react'

import { useAdminSession } from '@/components/admin'
import { ApiError } from '@/lib/request-json'

import { fetchPosts, moderatePost, type Feed, type ModerationAction } from './post.api'
import type { Post } from './post.model'

export type FeedState =
  { status: 'loading' } | { status: 'ready'; feed: Feed } | { status: 'error'; message: string }

export type UseFeed = {
  state: FeedState
  reload: () => void
  /** Admin only (undefined when signed out): moderate, then reload. */
  moderate?: (post: Post, action: ModerationAction) => Promise<void>
}

/**
 * Loads the feed with the admin token when signed in (so hidden posts come back too) and
 * reloads whenever the sign-in changes. One source for the For You feed and the admin list.
 */
export function useFeed(): UseFeed {
  const { token, isAdmin, signOut } = useAdminSession()
  const [state, setState] = useState<FeedState>({ status: 'loading' })
  const [reloadToken, setReloadToken] = useState(0)
  const [loadedFor, setLoadedFor] = useState(token)
  if (loadedFor !== token) {
    setLoadedFor(token)
    setState({ status: 'loading' })
  }

  function reload() {
    setState({ status: 'loading' })
    setReloadToken((value) => value + 1)
  }

  async function moderate(post: Post, action: ModerationAction) {
    if (!token) throw new Error('Please sign in again.')
    try {
      await moderatePost(token, post.id, action)
    } catch (err) {
      // an expired or revoked session signs out, so the UI stops offering admin actions
      if (err instanceof ApiError && err.status === 401) signOut()
      throw err
    }
    reload()
  }

  useEffect(() => {
    let cancelled = false
    fetchPosts(token).then(
      (feed) => {
        if (!cancelled) setState({ status: 'ready', feed })
      },
      (err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to load posts.',
          })
        }
      }
    )
    return () => {
      cancelled = true
    }
  }, [reloadToken, token])

  return { state, reload, moderate: isAdmin ? moderate : undefined }
}
