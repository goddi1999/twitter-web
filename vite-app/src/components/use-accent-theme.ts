import { useCallback, useSyncExternalStore } from 'react'

import { isAccentId, type AccentId } from '@/components/themes'

const STORAGE_KEY = 'vite-ui-accent'
const DEFAULT_ACCENT: AccentId = 'blue'

const listeners = new Set<() => void>()

function applyAccent(accent: AccentId) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (accent === 'default') {
    root.removeAttribute('data-accent')
  } else {
    root.dataset.accent = accent
  }
}

function readStoredAccent(): AccentId {
  if (typeof window === 'undefined') return DEFAULT_ACCENT
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isAccentId(stored) ? stored : DEFAULT_ACCENT
  } catch {
    return DEFAULT_ACCENT
  }
}

let accentSnapshot: AccentId = DEFAULT_ACCENT

if (typeof window !== 'undefined') {
  accentSnapshot = readStoredAccent()
  applyAccent(accentSnapshot)
}

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return accentSnapshot
}

function getServerSnapshot() {
  return DEFAULT_ACCENT
}

function setAccentSnapshot(next: AccentId) {
  accentSnapshot = next
  applyAccent(next)
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // ignore quota / private mode
  }
  emit()
}

/** Shared accent from `themes.ts` — sets `document.documentElement` `data-accent`. */
export function useAccentTheme() {
  const accent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setAccent = useCallback((next: AccentId) => {
    setAccentSnapshot(next)
  }, [])

  return { accent, setAccent }
}
