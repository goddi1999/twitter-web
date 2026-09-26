import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import './pulse-heart.css'

export type PulseHeartIcon = 'heart' | 'star' | 'thumb'

export interface PulseHeartProps {
  /** Controlled liked state. Changes from outside bind without a run. */
  liked?: boolean
  /** Initial state when uncontrolled. @default false */
  defaultLiked?: boolean
  /** Number shown; a press adds or removes one. @default 0 */
  count?: number
  /** Called on every press with the new liked state and count. */
  onChange?: (liked: boolean, count: number) => void
  /** Shows the count; off collapses the pill to a circle. @default true */
  showCount?: boolean
  /** Built-in glyph, or a custom element. @default 'heart' */
  icon?: PulseHeartIcon | ReactNode
  /** Draws the idle glyph as an outline. Off draws it as a muted solid. @default true */
  idleOutline?: boolean
  /** Glyph size in px; padding, gap and count size derive from it. @default 40 */
  size?: number
  /** Pill corner radius in px. @default 32 */
  corner?: number
  /** Colour after the flip, and of the hover tint and focus ring. @default '#ff4d4d' */
  likedColor?: string
  /** Colour before the flip. @default '#8b8b93' */
  idleColor?: string
  /** Background of the pill that beats under the glyph. @default '#232326' */
  pillColor?: string
  /** Colour of the count. @default '#ffffff' */
  textColor?: string
  /** Length of the whole run in ms; the flip is always at 40% of it. @default 560 */
  duration?: number
  /** How small the glyph gets at the flip, as a fraction of its size. @default 0.3 */
  dotSize?: number
  /** How far the glyph rebounds past rest on the way back. 0 lands without a rebound. @default 1.7 */
  overshoot?: number
  /** Percent the pill dips at the flip. @default 3 */
  beat?: number
  /** How long the changed glyph of the count takes to roll, in ms. @default 350 */
  rollDuration?: number
  /** Dims the button and ignores input. @default false */
  disabled?: boolean
  /** Accessible name; the count is appended to it. @default 'Like' */
  label?: string
  /** Extra classes for the button. */
  className?: string
}

type IconPath = { d: string }
type Roll = { a: string; b: string; at: number; up: boolean }
type Cell = { ch: string } | { top: string; bottom: string }

const OUT = 0.4

// Lucide's heart / star / thumbs-up path data, inlined so the swell
// animation can grab the <g> and scale it directly.
const ICONS: Record<PulseHeartIcon, readonly IconPath[]> = {
  heart: [
    {
      d: 'M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5',
    },
  ],
  star: [
    {
      d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
    },
  ],
  thumb: [
    {
      d: 'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z',
    },
    { d: 'M7 10v12' },
  ],
}

const back = (k: number, c: number) => {
  const u = k - 1
  return 1 + (c + 1) * u ** 3 + c * u ** 2
}
const swellOf = (t: number, c: number) =>
  t <= 0 ? 0 : t < OUT ? 1 - (1 - t / OUT) ** 3 : 1 - back((t - OUT) / (1 - OUT), c)
const format = (n: number) => new Intl.NumberFormat().format(n)
const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function PulseHeart({
  liked: likedProp,
  defaultLiked = false,
  count = 0,
  onChange,
  showCount = true,
  icon = 'heart',
  idleOutline = true,
  size = 40,
  corner = 32,
  likedColor = '#ff4d4d',
  idleColor = '#8b8b93',
  pillColor = '#232326',
  textColor = '#ffffff',
  duration = 560,
  dotSize = 0.3,
  overshoot = 1.7,
  beat = 3,
  rollDuration = 350,
  disabled = false,
  label = 'Like',
  className = '',
}: PulseHeartProps) {
  const controlled = likedProp !== undefined
  const [inner, setInner] = useState(defaultLiked)
  const [total, setTotal] = useState(count)
  const liked = controlled ? likedProp : inner
  const [shown, setShown] = useState({ liked, count })
  const [roll, setRoll] = useState<Roll | null>(null)

  const rootRef = useRef<HTMLButtonElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const heartRef = useRef<HTMLSpanElement>(null)
  const glyphRef = useRef<SVGGElement>(null)
  const rollRef = useRef<HTMLSpanElement>(null)
  const raf = useRef(0)
  const rollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const viaPointer = useRef(false)
  const shownRef = useRef(shown)
  const logical = useRef({ liked, count: total })
  logical.current = { liked, count: total }
  const cfg = useRef({ duration, dotSize, overshoot, beat, rollDuration })
  cfg.current = { duration, dotSize, overshoot, beat, rollDuration }

  useEffect(() => {
    setTotal(count)
  }, [count])

  useEffect(() => {
    if (raf.current) return
    if (shownRef.current.liked === liked && shownRef.current.count === total) return
    shownRef.current = { liked, count: total }
    setShown(shownRef.current)
  }, [liked, total])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || root.dataset.instant === undefined) return
    root.getBoundingClientRect()
    delete root.dataset.instant
  }, [shown])

  useLayoutEffect(() => {
    const el = rollRef.current
    if (!el || !roll) return
    el.style.transition = 'none'
    el.style.transform = `translateY(${roll.up ? '0' : '-1em'})`
    el.getBoundingClientRect()
    el.style.transition = ''
    el.style.transform = `translateY(${roll.up ? '-1em' : '0'})`
  }, [roll])

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current)
      clearTimeout(rollTimer.current)
    },
    [],
  )

  const startRoll = (from: number, to: number) => {
    if (from === to) return
    const a = format(from)
    const b = format(to)
    const changed = a.length === b.length ? [...b].flatMap((ch, i) => (ch !== a[i] ? [i] : [])) : []
    setRoll({ a, b, at: changed.length === 1 ? changed[0] : -1, up: to > from })
    clearTimeout(rollTimer.current)
    rollTimer.current = setTimeout(() => setRoll(null), cfg.current.rollDuration)
  }

  const run = (nextLiked: boolean, nextCount: number) => {
    const root = rootRef.current
    const heart = heartRef.current
    const pill = pillRef.current
    if (!root || !heart || !pill) return
    const glyph = glyphRef.current
    root.dataset.running = ''
    let swapped = false
    let prev = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const { duration: D, dotSize: dot, overshoot: c, beat: B } = cfg.current
      const t = Math.min(1, (now - t0) / D)
      const step = prev ? now - prev : 1000 / 60
      prev = now
      const s = swellOf(t, c)
      const k = 1 - (1 - dot) * s
      if (glyph) glyph.setAttribute('transform', `translate(12 12) scale(${k}) translate(-12 -12)`)
      else heart.style.transform = `scale(${k})`
      pill.style.transform = `scale(${1 - (B / 100) * s})`
      if (!swapped && t + step / 2 / D >= OUT) {
        swapped = true
        root.dataset.liked = String(nextLiked)
        startRoll(shownRef.current.count, nextCount)
        shownRef.current = { liked: nextLiked, count: nextCount }
        setShown(shownRef.current)
      }
      if (t < 1) {
        raf.current = requestAnimationFrame(tick)
        return
      }
      raf.current = 0
      if (glyph) glyph.removeAttribute('transform')
      heart.style.transform = ''
      pill.style.transform = ''
      delete root.dataset.running
      const l = logical.current
      if (l.liked !== shownRef.current.liked || l.count !== shownRef.current.count) {
        shownRef.current = { liked: l.liked, count: l.count }
        setShown(shownRef.current)
      }
    }
    raf.current = requestAnimationFrame(tick)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || disabled) return
    viaPointer.current = true
    if (!reducedMotion() && rootRef.current) rootRef.current.dataset.pressed = ''
  }
  const handlePointerUp = () => {
    if (rootRef.current) delete rootRef.current.dataset.pressed
  }
  const handlePointerCancel = () => {
    viaPointer.current = false
    handlePointerUp()
  }
  const handleKeyDown = () => {
    viaPointer.current = false
  }
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || raf.current) return
    const pointer = viaPointer.current && e.detail !== 0
    viaPointer.current = false
    const nextLiked = !liked
    const nextCount = total + (nextLiked ? 1 : -1)
    if (!controlled) setInner(nextLiked)
    setTotal(nextCount)
    onChange?.(nextLiked, nextCount)
    if (pointer && !reducedMotion()) run(nextLiked, nextCount)
    else if (rootRef.current) rootRef.current.dataset.instant = ''
  }

  const paths: readonly IconPath[] | null =
    typeof icon === 'string' && icon in ICONS
      ? ICONS[icon as PulseHeartIcon]
      : typeof icon === 'string'
        ? ICONS.heart
        : null
  const text = format(shown.count)
  const cells: Cell[] = roll
    ? roll.at === -1
      ? [{ top: roll.up ? roll.a : roll.b, bottom: roll.up ? roll.b : roll.a }]
      : [...roll.b].map((ch, i) =>
          i === roll.at ? { top: roll.up ? roll.a[i] : ch, bottom: roll.up ? ch : roll.a[i] } : { ch },
        )
    : [...text].map((ch) => ({ ch }))

  return (
    <button
      ref={rootRef}
      type="button"
      data-slot="pulse-heart"
      aria-pressed={liked}
      disabled={disabled}
      data-liked={String(shown.liked)}
      data-solid={idleOutline ? undefined : ''}
      data-no-count={showCount ? undefined : ''}
      className={`pulse-heart${className ? ` ${className}` : ''}`}
      style={
        {
          '--ph-size': `${size}px`,
          '--ph-corner': `${corner}px`,
          '--ph-pill': pillColor,
          '--ph-idle': idleColor,
          '--ph-liked': likedColor,
          '--ph-text': textColor,
          '--ph-roll': `${rollDuration}ms`,
          '--ph-stroke': `${(1.5 * size) / 24}px`,
        } as CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <span ref={pillRef} className="pulse-heart__pill">
        <span ref={heartRef} className="pulse-heart__heart" aria-hidden="true">
          {paths ? (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g ref={glyphRef}>
                {paths.map((p: IconPath, i: number) => (
                  <path key={i} d={p.d} vectorEffect="non-scaling-stroke" />
                ))}
              </g>
            </svg>
          ) : (
            icon
          )}
        </span>
        {showCount ? (
          <span className="pulse-heart__count" aria-hidden="true">
            {cells.map((cell, i) =>
              'ch' in cell ? (
                <span key={`c${i}`}>{cell.ch}</span>
              ) : (
                <span key={`r${i}`} className="pulse-heart__slot">
                  <span ref={rollRef} className="pulse-heart__roll">
                    <span>{cell.top}</span>
                    <span>{cell.bottom}</span>
                  </span>
                </span>
              ),
            )}
          </span>
        ) : null}
        <span className="pulse-heart__sr">{showCount ? `${label}, ${format(total)}` : label}</span>
      </span>
    </button>
  )
}
