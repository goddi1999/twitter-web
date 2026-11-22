import { HOUR } from './activity-timeline.constants'
import type { ActivityTimelineEvent, Group, Row } from './activity-timeline.types'

/** The calendar day an instant falls on in `timeZone`, as YYYY-MM-DD. */
export function dayKey(time: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(time))
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

export const timeOf = (event: ActivityTimelineEvent) => new Date(event.at).getTime()

export function relative(time: number, now: number) {
  const minutes = Math.max(0, Math.floor((now - time) / 60_000))
  if (minutes < 1) return { short: 'Now', long: 'just now' }
  if (minutes < 60) {
    return { short: `${minutes}m`, long: `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago` }
  }
  const hours = Math.floor(minutes / 60)
  return { short: `${hours}h`, long: `${hours} ${hours === 1 ? 'hour' : 'hours'} ago` }
}

/** Newest first, one group per day, labelled Today, Yesterday or the date. */
export function groupByDay(
  events: ActivityTimelineEvent[],
  now: number,
  timeZone: string,
  locale: string
): Group[] {
  const today = dayKey(now, timeZone)
  const yesterday = dayKey(now - 24 * HOUR, timeZone)
  const heading = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone,
  })
  const byDay = new Map<string, Row[]>()
  events
    .map((event) => ({ ...event, time: timeOf(event) }))
    .sort((a, b) => b.time - a.time)
    .forEach((event) => {
      const day = dayKey(event.time, timeZone)
      byDay.set(day, [...(byDay.get(day) ?? []), { ...event, day }])
    })
  return [...byDay].map(([day, rows]) => ({
    day,
    rows,
    label:
      day === today
        ? 'Today'
        : day === yesterday
          ? 'Yesterday'
          : heading.format(new Date(rows[0].time)),
  }))
}

export type TimelineUnit = { one: string; other: string }

export const DEFAULT_UNIT: TimelineUnit = { one: 'update', other: 'updates' }

export const plural = (count: number, unit: TimelineUnit) => (count === 1 ? unit.one : unit.other)
