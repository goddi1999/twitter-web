import type { ReactNode } from 'react'

export type ActivityTimelineTone = 'neutral' | 'success' | 'danger'

export type ActivityTimelineEvent = {
  id: string
  /** When it happened, as an ISO string or epoch milliseconds. */
  at: string | number
  /** Who did it, shown first in the foreground color. */
  actor?: string
  /** What happened, completing the actor: "merged Checkout redesign into main". */
  title: string
  /** Short context under the title, such as a pull request or a build. */
  meta?: ReactNode
  /** Revealed in place when the row is expanded. Rows without detail are not interactive. */
  detail?: ReactNode
  /** Portrait URL for an event by a person. */
  avatar?: string
  /** Icon for a system event, used when there is no avatar. */
  icon?: ReactNode
  /** Status of a system event. Always say the outcome in the title too, so it never rests on color. @default 'neutral' */
  tone?: ActivityTimelineTone
}

/**
 * A vertical activity feed grouped by day, for project history, audit logs and deploy streams.
 * Day labels stay pinned while their updates scroll, the connecting line draws itself as rows come
 * into view, rows expand in place, and new updates slide in at the top while the rest glide down.
 * Arrow keys move between rows; Enter or Space expands one.
 */
export type ActivityTimelineProps = {
  /** Updates in any order; the newest shows first. */
  events: ActivityTimelineEvent[]
  /** Reference time for relative labels and day groups, in epoch ms. Pass a clock that ticks about once a minute. */
  now: number
  /** Accessible name for the feed. */
  label: string
  /** Time zone for day groups and clock times. Fixed by default so server and client agree. @default 'UTC' */
  timeZone?: string
  /** @default 'en-US' */
  locale?: string
  /** Height of the scrolling area. Without it the feed grows with the page and reveals on page scroll. */
  maxHeight?: number | string
  /** Scroll back to the top when a new update arrives while the feed is scrolled down. @default true */
  scrollToNew?: boolean
  /** Ids of the rows expanded on mount. @default [] */
  defaultExpanded?: string[]
  /** What one row is called in the day count, e.g. { one: 'comment', other: 'comments' }. @default update/updates */
  unit?: { one: string; other: string }
  /** Heading level for the day labels. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  className?: string
}

export type Row = ActivityTimelineEvent & { time: number; day: string }

export type Group = { day: string; label: string; rows: Row[] }

/** Rows that come into view together are spaced a beat apart, so the line reads as drawing down. */
export type RevealClock = {
  /** Seconds this row waits before it reveals. */
  schedule: () => number
  reduced: boolean
  /** Ids added after the first render; they slide in instead of revealing in place. */
  fresh: Set<string>
}
