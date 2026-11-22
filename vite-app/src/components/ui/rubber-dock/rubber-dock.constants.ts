// --dock-lead: the pill edge facing the move, stiff so it gets there first
export const LEAD_SPRING = { type: 'spring', stiffness: 640, damping: 38, mass: 1 } as const
// --dock-trail: the edge that lags behind; lower = more stretch
export const TRAIL_SPRING = { type: 'spring', stiffness: 150, damping: 16, mass: 1 } as const
// --dock-drag-lead: the edge facing the pointer while you drag the pill
export const DRAG_LEAD_SPRING = { type: 'spring', stiffness: 1100, damping: 56, mass: 1 } as const
// --dock-drag-trail: the lagging edge while you drag
export const DRAG_TRAIL_SPRING = { type: 'spring', stiffness: 320, damping: 26, mass: 1 } as const
// dock.js (no token): both edges together when there is no direction to stretch in
export const SETTLE_SPRING = { type: 'spring', stiffness: 600, damping: 44, mass: 1 } as const
// --dock-open-w: dock -> card, the width lands first
export const OPEN_WIDTH_SPRING = { type: 'spring', stiffness: 340, damping: 21, mass: 1 } as const
// --dock-open-h: dock -> card, the height is softer so it overshoots after the width
export const OPEN_HEIGHT_SPRING = { type: 'spring', stiffness: 230, damping: 21, mass: 1 } as const
// --dock-close: card -> dock, height
export const CLOSE_HEIGHT_SPRING = { type: 'spring', stiffness: 420, damping: 30, mass: 1 } as const
// --dock-close softened (stiffness x .72, damping x .66) so the width bounces a little on the way in
export const CLOSE_WIDTH_SPRING = {
  type: 'spring',
  stiffness: 420 * 0.72,
  damping: 30 * 0.66,
  mass: 1,
} as const
// dock.js (no token): the card re-fitting its height to the next tab
export const SWAP_HEIGHT_SPRING = { type: 'spring', stiffness: 260, damping: 20, mass: 1 } as const
// dock.js (no token): the intro, one pill growing into the dock
export const INTRO_WIDTH_SPRING = { type: 'spring', stiffness: 220, damping: 15, mass: 1 } as const
// dock.js (no token): the whole dock giving way when you drag past the ends
export const NUDGE_SPRING = { type: 'spring', stiffness: 300, damping: 18, mass: 1 } as const
// --dock-pop: icon pop on select
export const POP_SPRING = { type: 'spring', stiffness: 520, damping: 16, mass: 1 } as const

// icon pop kicks, in scale units per second (pushed down, then they spring back past 1)
export const POP_SELECT = 3.2
export const POP_TOGGLE = 2.4

// the intro waits a beat before the pill grows into the dock
export const INTRO_DELAY_MS = 350
// --stagger: ms between card rows entering one after another
export const STAGGER_MS = 45
export const REVEAL_DELAY_MS = 70
// dock.css: rows fade/unblur over 400ms and slide over 700ms; leaving is 160ms / 280ms
export const REVEAL_FADE_MS = 400
export const REVEAL_MOVE_MS = 700
export const HIDE_FADE_MS = 160
export const HIDE_MOVE_MS = 280
// css `ease`, and dock.css's slide-in curve
export const CSS_EASE = [0.25, 0.1, 0.25, 1] as const
export const REVEAL_EASE = [0.16, 1, 0.3, 1] as const

// rows slide in from the side the tab is on, rise when the card opens, sink when it closes
export const ROW_SHIFT = 28
export const ROW_LIFT = 14
export const ROW_DROP = 6
export const ROW_SCALE = 0.98
export const ROW_BLUR = 5

export const TAB = 56
export const GAP = 4
export const PAD = 6
export const COLLAPSED_HEIGHT = TAB + PAD * 2
// the intro starts as a single pill
export const PILL_WIDTH = COLLAPSED_HEIGHT
// --dock-expanded-w
export const EXPANDED_WIDTH = 340
export const MAX_PANEL_HEIGHT = 300
// the card never gets closer than this to the viewport edges
export const VIEWPORT_MARGIN = 24
export const MIN_HEIGHT = 40
export const RADIUS = 34
// corners tighten by this much as the card opens
export const RADIUS_OPEN_DROP = 8

// the pill shortens as it stretches (area preserving), within these limits
export const PILL_MIN_WIDTH = 24
export const PILL_SQUASH_MIN = 0.66
export const PILL_SQUASH_MAX = 1.1

// while the height races, the width gives up to 4% (px/s of height speed per 1%)
export const GIVE_SPEED = 9000
export const GIVE_MAX = 0.04

// px before a press becomes a drag
export const DRAG_THRESHOLD = 4
// px a move must cover to count as a direction
export const DIRECTION_EPSILON = 0.5
// a flick toward the next tab rounds to it a little sooner
export const SNAP_BIAS = 0.18
// past the ends the dock follows a third of the overshoot
export const NUDGE_FACTOR = 0.35
// rubber band past the ends: max px of give, and how quickly it stiffens
export const RUBBER_REACH = 46
export const RUBBER_RATE = 0.55
