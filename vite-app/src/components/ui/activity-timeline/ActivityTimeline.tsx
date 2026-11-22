import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from 'react'

import { cn } from '@/lib/utils'

import { DURATION, EASE_STANDARD, FEATHER, RELATIVE_WINDOW } from './activity-timeline.constants'
import type { ActivityTimelineEvent, ActivityTimelineProps } from './activity-timeline.types'
import {
  DEFAULT_UNIT,
  dayKey,
  groupByDay,
  plural,
  relative,
  timeOf,
} from './activity-timeline.utils'
import { DaySection, RollingCount, TimelineRow } from './activity-timeline-parts'
import { RevealClockContext, useRevealSchedule } from './use-reveal-clock'

const subscribe = () => () => {}
/** False on the server and during hydration, so reduced motion never changes the first render. */
const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

const sentence = (event: ActivityTimelineEvent) =>
  [event.actor, event.title].filter(Boolean).join(' ')
const announce = (events: ActivityTimelineEvent[]) =>
  `New update: ${events.map(sentence).join('. ')}`

/**
 * A vertical activity feed grouped by day. Day labels stay pinned, the line draws itself as rows
 * come into view, rows expand in place, and new updates slide in at the top. Adapted from uiarc.
 */
export function ActivityTimeline({
  events,
  now,
  label,
  timeZone = 'UTC',
  locale = 'en-US',
  maxHeight,
  scrollToNew = true,
  defaultExpanded = [],
  unit = DEFAULT_UNIT,
  headingLevel = 3,
  className,
}: ActivityTimelineProps) {
  const hydrated = useHydrated()
  const prefersReduced = useReducedMotion()
  const reduced = hydrated && !!prefersReduced
  const baseId = useId()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(() => new Set(defaultExpanded))

  // rows added after the first render are fresh: they slide in, the rest glide down, and their
  // titles are announced
  const ids = events.map((event) => event.id).join('|')
  const [known, setKnown] = useState(() => ({
    ids,
    set: new Set(events.map((event) => event.id)),
    fresh: new Set<string>(),
    announcement: '',
  }))
  if (known.ids !== ids) {
    const added = events.filter((event) => !known.set.has(event.id))
    setKnown({
      ids,
      set: new Set(events.map((event) => event.id)),
      fresh: new Set([...known.fresh, ...added.map((event) => event.id)]),
      announcement: added.length ? announce(added) : known.announcement,
    })
  }

  // the bottom edge feathers while more updates wait below, and clears once the end is in view
  const scrolls = maxHeight !== undefined
  const feather = useMotionValue(0)
  // the mask stays bound and turns off with the scroll area, so a dropped style never lingers
  const mask = useTransform(() =>
    scrolls
      ? `linear-gradient(to bottom, #000 calc(100% - ${feather.get()}px), transparent)`
      : 'none'
  )
  useEffect(() => {
    const scroller = scrollerRef.current
    const track = trackRef.current
    if (!scrolls || !scroller || !track || typeof ResizeObserver === 'undefined') return
    let more: boolean | null = null
    const update = () => {
      const next = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop > 2
      if (next === more) return
      more = next
      animate(feather, next ? FEATHER : 0, {
        duration: reduced ? DURATION.instant : DURATION.standard,
        ease: EASE_STANDARD,
      })
    }
    update()
    scroller.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(scroller)
    observer.observe(track)
    return () => {
      scroller.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [scrolls, feather, reduced])

  const newestId = events.reduce<ActivityTimelineEvent | null>(
    (latest, event) => (!latest || timeOf(event) > timeOf(latest) ? event : latest),
    null
  )?.id
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scrollToNew || !scroller || scroller.scrollTop < 1) return
    scroller.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }, [newestId, scrollToNew, reduced])

  const [initialDays] = useState(
    () => new Set(events.map((event) => dayKey(timeOf(event), timeZone)))
  )
  const groups = useMemo(
    () => groupByDay(events, now, timeZone, locale),
    [events, now, timeZone, locale]
  )
  const formats = useMemo(
    () => ({
      clock: new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone }),
      full: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone,
      }),
    }),
    [locale, timeZone]
  )
  const clock = useRevealSchedule(reduced, known.fresh)

  function toggle(id: string) {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  /** Up and Down walk the expandable rows, Home and End jump to the first and last. */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const triggers = Array.from(
      scrollerRef.current?.querySelectorAll<HTMLElement>('[data-timeline-trigger]') ?? []
    )
    const index = triggers.indexOf(document.activeElement as HTMLElement)
    if (index < 0) return
    event.preventDefault()
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? triggers.length - 1
          : Math.min(Math.max(index + (event.key === 'ArrowDown' ? 1 : -1), 0), triggers.length - 1)
    triggers[next]?.focus()
  }

  return (
    <RevealClockContext.Provider value={clock}>
      <div
        data-slot="activity-timeline"
        role="region"
        aria-label={label}
        className={cn('relative grid min-w-0 text-foreground', className)}
      >
        {/* inserting at the top pushes rows down instead of the browser holding the scroll */}
        <motion.div
          ref={scrollerRef}
          data-scrolls={scrolls || undefined}
          className="min-w-0 [overflow-anchor:none] data-scrolls:[scrollbar-width:thin] data-scrolls:[scrollbar-color:color-mix(in_oklab,var(--foreground)_25%,transparent)_transparent] data-scrolls:overflow-y-auto data-scrolls:overscroll-contain"
          style={{
            maxHeight: scrolls ? maxHeight : undefined,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
          onKeyDown={onKeyDown}
        >
          {/* presence starts enabled so markers keep their hidden first frame; rows and days
              present at mount opt out of entering */}
          <div ref={trackRef}>
            <AnimatePresence>
              {groups.map((group) => {
                const headingId = `${baseId}-${group.day}`
                const count = group.rows.length
                return (
                  <DaySection
                    key={group.day}
                    id={headingId}
                    fresh={!initialDays.has(group.day)}
                    reduced={reduced}
                  >
                    {/* pinned while their updates scroll; set --timeline-surface on other surfaces */}
                    <div
                      id={headingId}
                      role="heading"
                      aria-level={headingLevel}
                      className="sticky top-0 z-[2] flex items-baseline justify-between gap-3 bg-[color:var(--timeline-surface,var(--card))] py-2 pr-3 text-sm leading-[1.4] font-medium text-foreground"
                    >
                      <span>{group.label}</span>
                      <span
                        className="text-xs font-normal text-muted-foreground tabular-nums"
                        aria-hidden="true"
                      >
                        <RollingCount value={count} reduced={reduced} /> {plural(count, unit)}
                      </span>
                      <span className="sr-only">{`, ${count} ${plural(count, unit)}`}</span>
                    </div>
                    <ol className="mb-3 list-none p-0">
                      <AnimatePresence>
                        {group.rows.map((row, index) => {
                          const date = new Date(row.time)
                          const recent = group.label === 'Today' && now - row.time < RELATIVE_WINDOW
                          const ago = recent ? relative(row.time, now) : null
                          return (
                            <TimelineRow
                              key={row.id}
                              row={row}
                              last={index === count - 1}
                              expanded={expanded.has(row.id)}
                              onToggle={() => toggle(row.id)}
                              timeLabel={ago ? ago.short : formats.clock.format(date)}
                              timeFull={
                                ago
                                  ? `${ago.long}, ${formats.full.format(date)}`
                                  : formats.full.format(date)
                              }
                            />
                          )
                        })}
                      </AnimatePresence>
                    </ol>
                  </DaySection>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>
        <span className="sr-only" role="status">
          {known.announcement}
        </span>
      </div>
    </RevealClockContext.Provider>
  )
}
