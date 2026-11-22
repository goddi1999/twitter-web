import {
  GAP,
  PILL_MIN_WIDTH,
  PILL_SQUASH_MAX,
  PILL_SQUASH_MIN,
  RUBBER_RATE,
  RUBBER_REACH,
  TAB,
  VIEWPORT_MARGIN,
} from './rubber-dock.constants'

type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Reduced motion keeps the spring but damps it critically, so nothing overshoots. */
export const springFor = (spring: Spring, reduced: boolean) =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness * spring.mass) } : spring

export const tabCenter = (index: number) => TAB / 2 + index * (TAB + GAP)

export const trackWidthFor = (count: number) => count * TAB + (count - 1) * GAP

export const cardWidth = (expandedWidth: number) =>
  Math.min(expandedWidth, window.innerWidth - VIEWPORT_MARGIN)

/** Past the ends the pill keeps following the pointer, with more and more resistance. */
export function rubberBand(x: number, min: number, max: number) {
  const give = (over: number) => (1 - 1 / ((over * RUBBER_RATE) / RUBBER_REACH + 1)) * RUBBER_REACH
  if (x < min) return min - give(min - x)
  if (x > max) return max + give(x - max)
  return x
}

/** The pill between its two edges. It gets shorter as it stretches, so it keeps its area. */
export function pillGeometry(a: number, b: number) {
  const width = Math.max(Math.abs(b - a), PILL_MIN_WIDTH)
  const height = TAB * clamp(1 / Math.sqrt(width / TAB), PILL_SQUASH_MIN, PILL_SQUASH_MAX)
  return { left: Math.min(a, b), width, height, top: (TAB - height) / 2 }
}

/** The tab an arrow, Home or End key moves to, or undefined for any other key. */
export function keyTarget(key: string, index: number, count: number) {
  if (key === 'ArrowRight') return Math.min(index + 1, count - 1)
  if (key === 'ArrowLeft') return Math.max(index - 1, 0)
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  return undefined
}
