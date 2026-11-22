import type { TargetAndTransition } from 'motion/react'

type Preset = { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }

export const SPRING_VALUES = { stiffness: 200, damping: 20, bounce: 0.2 }

export const DEFAULT_COLLAPSED = { width: 320, height: 211 }
export const DEFAULT_EXPANDED = { width: 480, height: undefined }

export const ANIMATION_PRESETS = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  'slide-up': { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } },
  'slide-down': { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } },
  'slide-left': { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 } },
  'slide-right': { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } },
  scale: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 } },
  rotate: { initial: { opacity: 0, rotate: -10 }, animate: { opacity: 1, rotate: 0 }, exit: { opacity: 0, rotate: -10 } },
  'blur-sm': {
    initial: { opacity: 0, filter: 'blur(4px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(4px)' },
  },
  'blur-md': {
    initial: { opacity: 0, filter: 'blur(8px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(8px)' },
  },
  'blur-lg': {
    initial: { opacity: 0, filter: 'blur(16px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(16px)' },
  },
} satisfies Record<string, Preset>

/** Reduced motion: every preset collapses to a plain fade. */
export const REDUCED_PRESET: Preset = ANIMATION_PRESETS.fade
