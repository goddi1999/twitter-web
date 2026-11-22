import { useEffect, useMemo } from 'react'
import { animate, motionValue, useMotionValue, useTransform } from 'motion/react'

import {
  DRAG_LEAD_SPRING,
  DRAG_TRAIL_SPRING,
  LEAD_SPRING,
  NUDGE_SPRING,
  POP_SPRING,
  SETTLE_SPRING,
  TAB,
  TRAIL_SPRING,
} from './rubber-dock.constants'
import { pillGeometry, springFor, tabCenter, trackWidthFor } from './rubber-dock.utils'

/**
 * The selection pill as two edges on separate springs. The edge facing the move is
 * stiff and the other one is lazy, so the pill stretches like rubber between tabs.
 */
export function useRubberPill({
  count,
  initialIndex,
  reduced,
}: {
  count: number
  initialIndex: number
  reduced: boolean
}) {
  const left = useMotionValue(tabCenter(initialIndex) - TAB / 2)
  const right = useMotionValue(tabCenter(initialIndex) + TAB / 2)
  const nudge = useMotionValue(0)
  // one pop per tab; plain motion values because the tab count can change
  const pops = useMemo(() => Array.from({ length: count }, () => motionValue(1)), [count])
  const trackWidth = trackWidthFor(count)

  const x = useTransform([left, right], ([a, b]: number[]) => pillGeometry(a, b).left)
  const y = useTransform([left, right], ([a, b]: number[]) => pillGeometry(a, b).top)
  const width = useTransform([left, right], ([a, b]: number[]) => pillGeometry(a, b).width)
  const height = useTransform([left, right], ([a, b]: number[]) => pillGeometry(a, b).height)
  const borderRadius = useTransform(height, (h) => h / 2)
  // the inverted icon row is clipped to the pill, so icons flip colour exactly where it is
  const clipPath = useTransform([left, right], ([a, b]: number[]) => {
    const pill = pillGeometry(a, b)
    const fromRight = trackWidth - pill.left - pill.width
    const fromBottom = TAB - pill.top - pill.height
    return `inset(${pill.top}px ${fromRight}px ${fromBottom}px ${pill.left}px round ${pill.height / 2}px)`
  })

  useEffect(() => () => pops.forEach((pop) => pop.stop()), [pops])
  useEffect(
    () => () => {
      left.stop()
      right.stop()
      nudge.stop()
    },
    [left, right, nudge],
  )

  function moveTo(center: number, dir: number, dragging: boolean) {
    const lead = dragging ? DRAG_LEAD_SPRING : LEAD_SPRING
    const trail = dragging ? DRAG_TRAIL_SPRING : TRAIL_SPRING
    const [leftSpring, rightSpring] =
      dir === 0 ? [SETTLE_SPRING, SETTLE_SPRING] : dir > 0 ? [trail, lead] : [lead, trail]
    animate(left, center - TAB / 2, springFor(leftSpring, reduced))
    animate(right, center + TAB / 2, springFor(rightSpring, reduced))
  }

  /** Spring onto a tab; without a hint the direction is wherever the pill is now. */
  function settleOn(index: number, dirHint?: number) {
    const center = tabCenter(index)
    const dir = dirHint ?? Math.sign(center - (left.get() + right.get()) / 2)
    moveTo(center, dir, false)
  }

  /** Push an icon's scale down; it springs back past 1, a little pop. */
  function kick(index: number, amount: number) {
    const pop = pops[index]
    if (reduced || !pop) return
    animate(pop, 1, { ...POP_SPRING, velocity: pop.getVelocity() - amount })
  }

  function nudgeTo(target: number) {
    animate(nudge, target, springFor(NUDGE_SPRING, reduced))
  }

  return {
    pops,
    nudge,
    indicator: { x, y, width, height, borderRadius },
    clipPath,
    moveTo,
    settleOn,
    kick,
    nudgeTo,
  }
}

export type RubberPill = ReturnType<typeof useRubberPill>
