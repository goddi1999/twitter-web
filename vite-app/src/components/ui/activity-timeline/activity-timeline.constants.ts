import type { Transition } from 'motion/react'

type Bezier = [number, number, number, number]

// uiarc motion tokens, inlined so the folder copies on its own
export const DURATION = { instant: 0.12, fast: 0.16, exit: 0.18, standard: 0.24 } as const
export const EASE_ENTER: Bezier = [0.16, 1, 0.3, 1]
export const EASE_STANDARD: Bezier = [0.22, 1, 0.36, 1]
export const SPRING_SNAPPY = { type: 'spring', visualDuration: 0.26, bounce: 0 } as const
export const SPRING_SMOOTH = { type: 'spring', visualDuration: 0.4, bounce: 0 } as const
export const SPRING_MORPH = { type: 'spring', visualDuration: 0.42, bounce: 0 } as const
export const BLUR_SUBTLE = 2
export const BLUR_SOFT = 4
export const INSTANT: Transition = { duration: 0 }

export const HOUR = 3_600_000
// rows within this long of now show a relative time, such as "12m"
export const RELATIVE_WINDOW = 12 * HOUR
// seconds between rows revealed together, so the line reads as drawing downward
export const STEP = 0.09
// rows queued at once never wait longer than this
export const MAX_WAIT = 0.45
// a fresh row waits for the rows below to start gliding before it reveals
export const FRESH_DELAY = 0.12
// how far the last visible row fades into the bottom edge while more updates wait below, in px
export const FEATHER = 36

// a 28px marker column, with the line centred under it
export const MARKER =
  'absolute top-2 left-0 z-[1] grid size-7 place-items-center rounded-full text-muted-foreground after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-foreground/10 [&_svg]:size-3.5 [&_svg]:stroke-2'

// a person's portrait sits on a hairline ring; a system event is a quiet node with its icon
export const TONES = {
  neutral: 'bg-card',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  danger: 'bg-[color-mix(in_oklab,var(--destructive)_12%,var(--card))] text-destructive',
} as const

// runs from just under this marker to just above the next one, and draws downward from its top
export const SEGMENT = 'absolute top-10 -bottom-1 left-[13.5px] w-px origin-top bg-foreground/25'

export const TRIGGER =
  'grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 rounded-[1.125rem] px-3 py-3 text-left outline-none [-webkit-tap-highlight-color:transparent] max-[420px]:gap-x-2 max-[420px]:px-2'
export const BUTTON_TRIGGER =
  'cursor-pointer grid-cols-[minmax(0,1fr)_auto_16px] transition-colors duration-160 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:bg-muted motion-reduce:transition-none'
