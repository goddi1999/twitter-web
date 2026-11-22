import {
  Children,
  Fragment,
  isValidElement,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react'
import { motion, useIsPresent, type MotionValue, type Variants } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  CSS_EASE,
  HIDE_FADE_MS,
  HIDE_MOVE_MS,
  REVEAL_DELAY_MS,
  REVEAL_EASE,
  REVEAL_FADE_MS,
  REVEAL_MOVE_MS,
  ROW_BLUR,
  ROW_DROP,
  ROW_LIFT,
  ROW_SCALE,
  ROW_SHIFT,
  STAGGER_MS,
} from './rubber-dock.constants'

type RowCustom = { index: number; dir: number; fromClosed: boolean; reduced: boolean }
/** Passed through AnimatePresence, so a leaving card slides the way the new tab came from. */
export type PanelExitCustom = { dir: number; reduced: boolean }

const HIDE = {
  opacity: { duration: HIDE_FADE_MS / 1000, ease: CSS_EASE },
  filter: { duration: HIDE_FADE_MS / 1000, ease: CSS_EASE },
  default: { duration: HIDE_MOVE_MS / 1000, ease: CSS_EASE },
}

// the dock.css transitions: rows enter staggered and leave all at once, faster
const ROW_VARIANTS: Variants = {
  hidden: ({ dir, fromClosed, reduced }: RowCustom) =>
    reduced
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: dir * ROW_SHIFT,
          y: fromClosed ? ROW_LIFT : 0,
          scale: ROW_SCALE,
          filter: `blur(${ROW_BLUR}px)`,
        },
  shown: ({ index }: RowCustom) => {
    const delay = (REVEAL_DELAY_MS + index * STAGGER_MS) / 1000
    return {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        opacity: { duration: REVEAL_FADE_MS / 1000, ease: CSS_EASE, delay },
        filter: { duration: REVEAL_FADE_MS / 1000, ease: CSS_EASE, delay },
        default: { duration: REVEAL_MOVE_MS / 1000, ease: REVEAL_EASE, delay },
      },
    }
  },
  gone: ({ dir, reduced }: PanelExitCustom) =>
    reduced
      ? { opacity: 0, transition: HIDE }
      : {
          opacity: 0,
          x: -dir * ROW_SHIFT,
          y: dir ? 0 : ROW_DROP,
          scale: ROW_SCALE,
          filter: `blur(${ROW_BLUR}px)`,
          transition: HIDE,
        },
}

function flattenChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
      ? flattenChildren(child.props.children)
      : [child],
  )
}

export function TabIcon({ icon, scale }: { icon: ReactNode; scale: MotionValue<number> }) {
  return (
    <motion.span className="grid place-items-center [&_svg]:size-[22px]" style={{ scale }}>
      {icon}
    </motion.span>
  )
}

/** One tab's card. It reports its height so the dock can fit it, and staggers its rows in. */
export function DockPanel({
  id,
  tabId,
  dir,
  fromClosed,
  reduced,
  onMeasure,
  children,
}: {
  id: string
  tabId: string
  dir: number
  fromClosed: boolean
  reduced: boolean
  onMeasure: (height: number, opening: boolean) => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isPresent = useIsPresent()

  const report = useEffectEvent((first: boolean) => {
    const node = ref.current
    if (node) onMeasure(node.offsetHeight, first && fromClosed)
  })

  // a leaving card stops reporting, so it cannot fight the next one
  useLayoutEffect(() => {
    const node = ref.current
    if (!isPresent || !node) return
    let first = true
    const observer = new ResizeObserver(() => {
      report(first)
      first = false
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [isPresent])

  return (
    <motion.div
      ref={ref}
      id={id}
      role="tabpanel"
      aria-labelledby={tabId}
      initial="hidden"
      animate="shown"
      exit="gone"
      className={cn(
        'absolute inset-x-0 top-0 px-5 pt-5 pb-2',
        isPresent ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      {flattenChildren(children).map((child, index) => (
        <motion.div
          key={index}
          variants={ROW_VARIANTS}
          custom={{ index, dir, fromClosed, reduced } satisfies RowCustom}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
