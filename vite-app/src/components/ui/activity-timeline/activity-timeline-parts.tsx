import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { Transition, Variants } from 'motion/react'
import { useId, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
  BLUR_SOFT,
  BLUR_SUBTLE,
  BUTTON_TRIGGER,
  DURATION,
  EASE_ENTER,
  EASE_STANDARD,
  FRESH_DELAY,
  INSTANT,
  MARKER,
  SEGMENT,
  SPRING_MORPH,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
  TONES,
  TRIGGER,
} from './activity-timeline.constants'
import type { Row } from './activity-timeline.types'
import { useRevealClock } from './use-reveal-clock'

const riseVariants = (reduced: boolean): Variants => ({
  from: (dir: number) =>
    reduced ? { opacity: 0 } : { opacity: 0, y: `${0.3 * dir}em`, filter: `blur(${BLUR_SOFT}px)` },
  to: { opacity: 1, y: '0em', filter: 'blur(0px)' },
  gone: (dir: number) =>
    reduced
      ? { opacity: 0, transition: INSTANT }
      : {
          opacity: 0,
          y: `${-0.3 * dir}em`,
          filter: `blur(${BLUR_SUBTLE}px)`,
          transition: { duration: DURATION.fast, ease: EASE_STANDARD },
        },
})

/** Text that changes in place: the new value rises in from a soft blur while the old one lifts away. */
export function RiseText({
  text,
  reduced,
  direction = 1,
}: {
  text: string
  reduced: boolean
  direction?: number
}) {
  return (
    <span className="relative inline-flex" aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={text}
          className="inline-block whitespace-nowrap"
          custom={direction}
          variants={riseVariants(reduced)}
          initial="from"
          animate="to"
          exit="gone"
          transition={{
            duration: reduced ? DURATION.instant : DURATION.standard,
            ease: EASE_ENTER,
          }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** The day's update count rolls digit by digit in the direction it moved. */
export function RollingCount({ value, reduced }: { value: number; reduced: boolean }) {
  const [track, setTrack] = useState({ value, direction: 1 })
  if (track.value !== value) setTrack({ value, direction: value > track.value ? 1 : -1 })
  const digits = [...String(value)]

  return (
    <span className="inline-flex" aria-hidden="true">
      {digits.map((digit, index) => (
        <span
          key={digits.length - 1 - index}
          className="relative inline-flex overflow-clip [overflow-clip-margin:.15em]"
        >
          <RiseText text={digit} reduced={reduced} direction={track.direction} />
        </span>
      ))}
    </span>
  )
}

/** A new day opens from nothing and pushes the older days down; it clips only while it grows. */
export function DaySection({
  id,
  fresh,
  reduced,
  children,
}: {
  id: string
  fresh: boolean
  reduced: boolean
  children: ReactNode
}) {
  const [entering, setEntering] = useState(fresh)

  return (
    <motion.section
      className="relative data-entering:overflow-clip"
      aria-labelledby={id}
      data-entering={entering || undefined}
      initial={fresh ? { height: 0, opacity: 0 } : false}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{
        height: 0,
        opacity: 0,
        transition: {
          duration: reduced ? DURATION.instant : DURATION.exit,
          ease: EASE_STANDARD,
        },
      }}
      transition={
        reduced
          ? { duration: 0.15 }
          : {
              height: SPRING_SMOOTH,
              opacity: { duration: DURATION.standard, ease: EASE_ENTER },
            }
      }
      onAnimationComplete={() => setEntering(false)}
    >
      {children}
    </motion.section>
  )
}

type TimelineRowProps = {
  row: Row
  last: boolean
  expanded: boolean
  onToggle: () => void
  timeLabel: string
  timeFull: string
}

export function TimelineRow({
  row,
  last,
  expanded,
  onToggle,
  timeLabel,
  timeFull,
}: TimelineRowProps) {
  const clock = useRevealClock()
  const { reduced } = clock
  const detailId = useId()
  // the row reveals once, the first time it scrolls into view: its marker pops, then its line draws
  // toward the next row
  const [revealDelay, setRevealDelay] = useState<number | null>(null)
  const fresh = clock.fresh.has(row.id)
  const [entering, setEntering] = useState(fresh)
  const shown = revealDelay !== null
  const delay = (revealDelay ?? 0) + (fresh ? FRESH_DELAY : 0)
  const pop: Transition = reduced
    ? { duration: 0, opacity: { duration: 0.15 } }
    : {
        ...SPRING_MORPH,
        visualDuration: 0.36,
        delay,
        opacity: { duration: DURATION.fast, ease: EASE_ENTER, delay },
      }
  const draw: Transition = reduced
    ? INSTANT
    : { ...SPRING_SMOOTH, visualDuration: 0.34, delay: delay + 0.1 }
  const tone = row.avatar ? undefined : (row.tone ?? 'neutral')

  const text = (
    <>
      <span className="grid min-w-0 gap-0.5">
        <span className="text-sm leading-5 text-muted-foreground">
          {row.actor ? <span className="font-medium text-foreground">{row.actor}</span> : null}
          {row.actor ? ' ' : ''}
          {row.title}
        </span>
        {row.meta ? (
          <span className="text-xs leading-[1.4] text-muted-foreground">{row.meta}</span>
        ) : null}
      </span>
      {/* times keep a steady column, so "9m" becoming "10m" never rewraps the title beside it */}
      <time
        className="flex min-w-11 justify-end text-xs leading-5 whitespace-nowrap text-muted-foreground tabular-nums"
        dateTime={new Date(row.time).toISOString()}
        title={timeFull}
      >
        <RiseText text={timeLabel} reduced={reduced} />
        <span className="sr-only">{timeFull}</span>
      </time>
    </>
  )

  return (
    <motion.li
      className="relative pl-9 data-entering:overflow-clip"
      data-entering={entering || undefined}
      initial={fresh ? { height: 0 } : false}
      animate={{ height: 'auto' }}
      exit={{
        height: 0,
        opacity: 0,
        transition: reduced
          ? { duration: 0.1 }
          : {
              height: { ...SPRING_SMOOTH, visualDuration: 0.3 },
              opacity: { duration: DURATION.instant },
            },
      }}
      transition={reduced ? INSTANT : SPRING_SMOOTH}
      onAnimationComplete={() => setEntering(false)}
      onViewportEnter={() => setRevealDelay((current) => current ?? clock.schedule())}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.span
        className={cn(MARKER, tone && TONES[tone])}
        data-tone={tone}
        aria-hidden="true"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={shown ? { scale: 1, opacity: 1 } : undefined}
        transition={pop}
      >
        {row.avatar ? (
          <img
            src={row.avatar}
            alt=""
            width={28}
            height={28}
            decoding="async"
            className="block size-full rounded-[inherit] object-cover"
          />
        ) : (
          row.icon
        )}
      </motion.span>
      {!last && (
        <motion.span
          className={SEGMENT}
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          animate={shown ? { scaleY: 1 } : undefined}
          transition={draw}
        />
      )}
      <motion.div
        className="min-w-0"
        initial={
          fresh
            ? reduced
              ? { opacity: 0 }
              : { opacity: 0, y: -10, filter: `blur(${BLUR_SOFT}px)` }
            : false
        }
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={
          reduced
            ? { duration: 0.15 }
            : {
                y: SPRING_SMOOTH,
                opacity: { duration: DURATION.standard, ease: EASE_ENTER, delay: 0.05 },
                filter: { duration: DURATION.standard, ease: EASE_ENTER, delay: 0.05 },
              }
        }
      >
        {row.detail ? (
          <button
            type="button"
            data-timeline-trigger=""
            aria-expanded={expanded}
            aria-controls={expanded ? detailId : undefined}
            onClick={onToggle}
            className={cn(TRIGGER, BUTTON_TRIGGER)}
          >
            {text}
            <motion.span
              className="grid h-5 place-items-center text-muted-foreground"
              aria-hidden="true"
              initial={false}
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={reduced ? INSTANT : SPRING_SNAPPY}
            >
              <ChevronDown size={16} strokeWidth={1.75} />
            </motion.span>
          </button>
        ) : (
          <div className={TRIGGER}>{text}</div>
        )}
        <AnimatePresence initial={false}>
          {expanded && row.detail ? (
            <motion.div
              key="detail"
              id={detailId}
              className="overflow-clip [overflow-clip-margin:4px]"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{
                height: 0,
                transition: reduced ? INSTANT : { ...SPRING_SMOOTH, visualDuration: 0.28 },
              }}
              transition={reduced ? INSTANT : SPRING_SMOOTH}
            >
              <motion.div
                className="px-3 pb-4 text-sm leading-[1.4] text-muted-foreground max-[420px]:px-2"
                initial={
                  reduced ? { opacity: 0 } : { opacity: 0, y: -4, filter: `blur(${BLUR_SOFT}px)` }
                }
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{
                  opacity: 0,
                  transition: { duration: DURATION.instant, ease: EASE_STANDARD },
                }}
                transition={
                  reduced
                    ? { duration: 0.15 }
                    : { duration: DURATION.standard, ease: EASE_ENTER, delay: 0.06 }
                }
              >
                {row.detail}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.li>
  )
}
