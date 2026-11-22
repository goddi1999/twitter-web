import { useEffect } from 'react'
import { animate, useMotionValue, useTransform, useVelocity, type MotionValue } from 'motion/react'

import {
  CLOSE_HEIGHT_SPRING,
  CLOSE_WIDTH_SPRING,
  COLLAPSED_HEIGHT,
  GIVE_MAX,
  GIVE_SPEED,
  INTRO_DELAY_MS,
  INTRO_WIDTH_SPRING,
  MAX_PANEL_HEIGHT,
  MIN_HEIGHT,
  OPEN_HEIGHT_SPRING,
  OPEN_WIDTH_SPRING,
  PILL_WIDTH,
  RADIUS,
  RADIUS_OPEN_DROP,
  SWAP_HEIGHT_SPRING,
} from './rubber-dock.constants'
import { cardWidth, clamp, springFor } from './rubber-dock.utils'

/**
 * The dock's own size: a pill on first paint, a dock, or a card. Width and height
 * run on different springs so the width lands first and the height overshoots after.
 */
export function useDockMorph({
  expanded,
  collapsedWidth,
  expandedWidth,
  nudge,
  reduced,
}: {
  expanded: boolean
  collapsedWidth: number
  expandedWidth: number
  nudge: MotionValue<number>
  reduced: boolean
}) {
  // reduced motion skips the intro and starts as the dock
  const width = useMotionValue(reduced ? collapsedWidth : PILL_WIDTH)
  const height = useMotionValue(COLLAPSED_HEIGHT)
  const heightVelocity = useVelocity(height)

  // while the height races, the width gives a little, so it moves like one soft object
  const shownWidth = useTransform([width, heightVelocity], ([w, v]: number[]) =>
    w * (1 + clamp(-v / GIVE_SPEED, -GIVE_MAX, GIVE_MAX)),
  )
  const shownHeight = useTransform(height, (h) => Math.max(h, MIN_HEIGHT))
  const borderRadius = useTransform(shownHeight, (h) => {
    const open = clamp((h - COLLAPSED_HEIGHT) / MAX_PANEL_HEIGHT, 0, 1)
    return Math.min(h / 2, RADIUS - RADIUS_OPEN_DROP * open)
  })
  // centred on the root so it grows both ways; the nudge shifts it when dragged past the ends
  const x = useTransform([shownWidth, nudge], ([w, n]: number[]) => n - w / 2)
  const y = useTransform(shownHeight, (h) => -h / 2)

  useEffect(() => {
    if (expanded) {
      // the height follows once the card content has been measured
      const fit = () => animate(width, cardWidth(expandedWidth), springFor(OPEN_WIDTH_SPRING, reduced))
      fit()
      window.addEventListener('resize', fit)
      return () => window.removeEventListener('resize', fit)
    }
    if (width.get() === PILL_WIDTH) {
      // first paint: the single pill grows into the dock
      animate(width, collapsedWidth, {
        ...springFor(INTRO_WIDTH_SPRING, reduced),
        delay: INTRO_DELAY_MS / 1000,
      })
      return
    }
    animate(width, collapsedWidth, springFor(CLOSE_WIDTH_SPRING, reduced))
    animate(height, COLLAPSED_HEIGHT, springFor(CLOSE_HEIGHT_SPRING, reduced))
  }, [expanded, collapsedWidth, expandedWidth, reduced, width, height])

  useEffect(
    () => () => {
      width.stop()
      height.stop()
    },
    [width, height],
  )

  /** Fit the card to a tab's content: the open spring on the way out, a softer one between tabs. */
  function fitPanel(contentHeight: number, opening: boolean) {
    animate(
      height,
      COLLAPSED_HEIGHT + Math.min(contentHeight, MAX_PANEL_HEIGHT),
      springFor(opening ? OPEN_HEIGHT_SPRING : SWAP_HEIGHT_SPRING, reduced),
    )
  }

  return {
    style: { width: shownWidth, height: shownHeight, borderRadius, x, y },
    fitPanel,
  }
}
