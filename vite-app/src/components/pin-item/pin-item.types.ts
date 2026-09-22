import type { ComponentType } from 'react'

export type PlaceItem = {
  id: string
  name: string
  /** Category line, e.g. `Cafe`. */
  type: string
  /** Availability line, e.g. `Closes 9:00 PM`. */
  status: string
  icon: ComponentType<{ className?: string }>
  pinned?: boolean
}

export type PinnedPlacesListProps = {
  items?: PlaceItem[]
  pinnedTitle?: string
  allTitle?: string
  onPinnedChange?: (pinnedIds: string[]) => void
  className?: string
}
