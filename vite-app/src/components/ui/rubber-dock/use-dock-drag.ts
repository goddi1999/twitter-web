import { useRef, useState, type PointerEvent, type RefObject } from 'react'

import {
  DIRECTION_EPSILON,
  DRAG_THRESHOLD,
  GAP,
  NUDGE_FACTOR,
  SNAP_BIAS,
  TAB,
} from './rubber-dock.constants'
import { clamp, rubberBand, tabCenter, trackWidthFor } from './rubber-dock.utils'
import type { RubberPill } from './use-rubber-pill'

type Drag = {
  pointerId: number
  startX: number
  lastX: number
  live: boolean
  dir: number
  center: number
}

/**
 * Drag the pill along the tabs. It follows on the stiffer drag springs, rubber-bands
 * past the ends (the whole dock gives a little too) and snaps to the nearest tab,
 * leaning toward the way you were moving.
 */
export function useDockDrag({
  count,
  rootRef,
  pill,
  onRelease,
}: {
  count: number
  rootRef: RefObject<HTMLDivElement | null>
  pill: RubberPill
  onRelease: (index: number, dir: number) => void
}) {
  const drag = useRef<Drag | null>(null)
  // the click that ends a drag should not also toggle the card
  const swallowClick = useRef(false)
  const [dragging, setDragging] = useState(false)

  // pointer x in the tab row, measured from the root so the nudge does not feed back
  const trackX = (clientX: number) => {
    const root = rootRef.current
    if (!root) return clientX
    const rect = root.getBoundingClientRect()
    return clientX - (rect.left + rect.width / 2) + trackWidthFor(count) / 2
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    swallowClick.current = false
    const x = trackX(event.clientX)
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: x,
      live: false,
      dir: 0,
      center: x,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current || event.pointerId !== current.pointerId) return
    if (!current.live) {
      if (Math.abs(event.clientX - current.startX) <= DRAG_THRESHOLD) return
      current.live = true
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
    }
    const x = trackX(event.clientX)
    const delta = x - current.lastX
    current.lastX = x
    if (Math.abs(delta) > DIRECTION_EPSILON) current.dir = Math.sign(delta)

    const first = tabCenter(0)
    const last = tabCenter(count - 1)
    const center = rubberBand(x, first, last)
    current.center = center
    pill.moveTo(center, current.dir, true)
    pill.nudgeTo((center - clamp(center, first, last)) * NUDGE_FACTOR)
  }

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current || event.pointerId !== current.pointerId) return
    drag.current = null
    if (!current.live) return
    swallowClick.current = true
    setDragging(false)
    pill.nudgeTo(0)
    const nearest = (current.center - tabCenter(0)) / (TAB + GAP) + current.dir * SNAP_BIAS
    onRelease(Math.round(nearest), current.dir)
  }

  /** True once after a drag, so the tab click it causes can be ignored. */
  const consumeClick = () => {
    const swallow = swallowClick.current
    swallowClick.current = false
    return swallow
  }

  return {
    dragging,
    consumeClick,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
    },
  }
}
