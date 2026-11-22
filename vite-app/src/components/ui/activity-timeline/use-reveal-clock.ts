import { createContext, useContext, useMemo, useRef } from 'react'

import { MAX_WAIT, STEP } from './activity-timeline.constants'
import type { RevealClock } from './activity-timeline.types'

// rows reveal against the viewport, which already clips by the scroll area, so they wait until
// they are visible in both
export const RevealClockContext = createContext<RevealClock | null>(null)

export function useRevealClock() {
  const clock = useContext(RevealClockContext)
  if (!clock) throw new Error('ActivityTimeline rows must render inside ActivityTimeline')
  return clock
}

/** Rows that come into view together are spaced a beat apart, so the line draws down the feed. */
export function useRevealSchedule(reduced: boolean, fresh: Set<string>): RevealClock {
  const nextReveal = useRef(0)
  return useMemo(
    () => ({
      reduced,
      fresh,
      schedule: () => {
        if (reduced) return 0
        const current = performance.now() / 1000
        const start = Math.min(Math.max(current, nextReveal.current), current + MAX_WAIT)
        nextReveal.current = start + STEP
        return start - current
      },
    }),
    [reduced, fresh]
  )
}
