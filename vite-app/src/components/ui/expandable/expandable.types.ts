import type { HTMLMotionProps, TargetAndTransition, Transition } from 'motion/react'
import type { ReactNode } from 'react'

import type { ANIMATION_PRESETS } from './expandable.constants'

export type ExpandDirection = 'vertical' | 'horizontal' | 'both'
export type ExpandBehavior = 'replace' | 'push'
export type ExpandableEase = 'easeInOut' | 'easeIn' | 'easeOut' | 'linear' | [number, number, number, number]
export type ExpandablePreset = keyof typeof ANIMATION_PRESETS

export type ExpandableContextValue = {
  isExpanded: boolean
  toggleExpand: () => void
  expandDirection: ExpandDirection
  expandBehavior: ExpandBehavior
  transitionDuration: number
  easeType: ExpandableEase
  initialDelay: number
  reducedMotion: boolean
  onExpandEnd?: () => void
  onCollapseEnd?: () => void
}

export type ExpandableProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode | ((props: { isExpanded: boolean }) => ReactNode)
  /** Controlled open state. Pair with `onToggle`. */
  expanded?: boolean
  onToggle?: () => void
  transitionDuration?: number
  easeType?: ExpandableEase
  expandDirection?: ExpandDirection
  expandBehavior?: ExpandBehavior
  initialDelay?: number
  onExpandStart?: () => void
  onExpandEnd?: () => void
  onCollapseStart?: () => void
  onCollapseEnd?: () => void
}

export type ExpandableAnimation = {
  initial?: TargetAndTransition
  animate?: TargetAndTransition
  exit?: TargetAndTransition
  transition?: Transition
}

export type ExpandableContentProps = Omit<HTMLMotionProps<'div'>, 'ref'> & {
  preset?: ExpandablePreset
  animateIn?: ExpandableAnimation
  animateOut?: ExpandableAnimation
  stagger?: boolean
  staggerChildren?: number
  keepMounted?: boolean
}

export type ExpandableSize = { width?: number; height?: number }

export type ExpandableCardProps = {
  children: ReactNode
  className?: string
  collapsedSize?: ExpandableSize
  expandedSize?: ExpandableSize
  hoverToExpand?: boolean
  /** ms before a hover expands. */
  expandDelay?: number
  /** ms before leaving collapses. */
  collapseDelay?: number
}
