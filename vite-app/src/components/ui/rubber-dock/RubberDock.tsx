import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  COLLAPSED_HEIGHT,
  EXPANDED_WIDTH,
  MAX_PANEL_HEIGHT,
  PAD,
  POP_SELECT,
  POP_TOGGLE,
  TAB,
  VIEWPORT_MARGIN,
} from './rubber-dock.constants'
import type { RubberDockProps } from './rubber-dock.types'
import { DockPanel, TabIcon, type PanelExitCustom } from './rubber-dock-parts'
import { clamp, keyTarget, trackWidthFor } from './rubber-dock.utils'
import { useDockDrag } from './use-dock-drag'
import { useDockMorph } from './use-dock-morph'
import { useRubberPill } from './use-rubber-pill'

const TAB_BUTTON =
  'grid size-14 shrink-0 cursor-[inherit] place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring'

/**
 * A tab bar whose pill stretches like rubber between tabs and can be dragged.
 * Click the active tab again and the whole dock morphs into that tab's card.
 */
export function RubberDock({
  items,
  value: valueProp,
  defaultValue = items[0]?.value,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  expandedWidth = EXPANDED_WIDTH,
  'aria-label': ariaLabel = 'Sections',
  className,
  style,
  ...props
}: RubberDockProps) {
  const reduced = useReducedMotion() ?? false
  const baseId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  // the direction a drag was moving when it let go, for the pill's next move
  const pendingDir = useRef<number | undefined>(undefined)

  const [innerValue, setInnerValue] = useState(defaultValue)
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const value = valueProp !== undefined ? valueProp : innerValue
  const open = openProp !== undefined ? openProp : innerOpen

  const count = items.length
  // an unknown value shows the first tab
  const activeIndex = Math.max(0, items.findIndex((item) => item.value === value))
  const activeItem = items[activeIndex]
  const expanded = open && activeItem?.content !== undefined
  const trackWidth = trackWidthFor(count)
  const collapsedWidth = trackWidth + PAD * 2
  const tabId = (index: number) => `${baseId}-tab-${index}`
  const panelId = (index: number) => `${baseId}-panel-${index}`

  // which way the card rows slide, worked out whenever the tab or open state changes
  const [panelMotion, setPanelMotion] = useState({
    index: activeIndex,
    expanded,
    dir: 0,
    fromClosed: true,
  })
  if (panelMotion.index !== activeIndex || panelMotion.expanded !== expanded) {
    setPanelMotion({
      index: activeIndex,
      expanded,
      dir: expanded && panelMotion.expanded ? Math.sign(activeIndex - panelMotion.index) : 0,
      fromClosed: !panelMotion.expanded,
    })
  }

  const pill = useRubberPill({ count, initialIndex: activeIndex, reduced })
  const dock = useDockMorph({
    expanded,
    collapsedWidth,
    expandedWidth,
    nudge: pill.nudge,
    reduced,
  })

  const setValue = (next: string) => {
    if (valueProp === undefined) setInnerValue(next)
    onValueChange?.(next)
  }

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInnerOpen(next)
    onOpenChange?.(next)
  }

  const select = (index: number, dirHint?: number) => {
    const next = clamp(index, 0, count - 1)
    if (next === activeIndex) {
      // nothing to change (a drag let go where it started): the pill still springs home
      pill.settleOn(next, dirHint)
      pill.kick(next, POP_SELECT)
      return
    }
    pendingDir.current = dirHint
    setValue(items[next].value)
    if (open && items[next].content === undefined) setOpen(false)
  }

  const drag = useDockDrag({ count, rootRef, pill, onRelease: select })

  // the pill follows the active tab, whoever changed it
  const followActive = useEffectEvent((index: number) => {
    const dirHint = pendingDir.current
    pendingDir.current = undefined
    pill.settleOn(index, dirHint)
    pill.kick(index, POP_SELECT)
  })
  useEffect(() => followActive(activeIndex), [activeIndex])

  const wasExpanded = useRef(expanded)
  const popOnToggle = useEffectEvent(() => pill.kick(activeIndex, POP_TOGGLE))
  useEffect(() => {
    if (wasExpanded.current === expanded) return
    wasExpanded.current = expanded
    popOnToggle()
  }, [expanded])

  const close = useEffectEvent(() => setOpen(false))
  useEffect(() => {
    if (!expanded) return
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    // wait a tick so the click that opened the card does not close it again
    const timer = window.setTimeout(() => document.addEventListener('click', handleClick))
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [expanded])

  const handleTabClick = (index: number) => {
    if (drag.consumeClick()) return
    if (index === activeIndex && items[index].content !== undefined) setOpen(!expanded)
    else select(index)
  }

  const handleTabsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = keyTarget(event.key, activeIndex, count)
    if (target === undefined) return
    event.preventDefault()
    select(target)
    tabRefs.current[target]?.focus()
  }

  const handlePanelMeasure = (contentHeight: number, opening: boolean) => {
    if (expanded) dock.fitPanel(contentHeight, opening)
  }

  return (
    <div
      ref={rootRef}
      data-slot="rubber-dock"
      data-state={expanded ? 'open' : 'closed'}
      className={cn('relative shrink-0', className)}
      style={{ width: collapsedWidth, height: COLLAPSED_HEIGHT, ...style }}
      {...props}
    >
      <motion.div
        data-slot="rubber-dock-surface"
        // a hairline only in light mode, where the muted surface is close to the card
        className="absolute top-1/2 left-1/2 overflow-hidden bg-muted ring-1 ring-border dark:ring-0"
        style={dock.style}
      >
        <div
          // content taller than the cap is clipped instead of running under the tabs
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 overflow-hidden"
          style={{
            width: `min(${expandedWidth}px, 100vw - ${VIEWPORT_MARGIN}px)`,
            height: MAX_PANEL_HEIGHT,
          }}
        >
          <AnimatePresence custom={{ dir: panelMotion.dir, reduced } satisfies PanelExitCustom}>
            {expanded && (
              <DockPanel
                key={activeItem.value}
                id={panelId(activeIndex)}
                tabId={tabId(activeIndex)}
                dir={panelMotion.dir}
                fromClosed={panelMotion.fromClosed}
                reduced={reduced}
                onMeasure={handlePanelMeasure}
              >
                {activeItem.content}
              </DockPanel>
            )}
          </AnimatePresence>
        </div>

        <div
          role="tablist"
          aria-label={ariaLabel}
          aria-orientation="horizontal"
          className={cn(
            'absolute bottom-1.5 left-1/2 -translate-x-1/2 touch-none select-none',
            drag.dragging ? 'cursor-grabbing' : 'cursor-grab',
          )}
          style={{ width: trackWidth, height: TAB }}
          onKeyDown={handleTabsKeyDown}
          {...drag.handlers}
        >
          <div className="absolute inset-0 flex gap-1 text-muted-foreground">
            {items.map((item, index) => {
              const active = index === activeIndex
              return (
                <button
                  key={item.value}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  id={tabId(index)}
                  aria-label={item.label}
                  aria-selected={active}
                  aria-controls={active && expanded ? panelId(index) : undefined}
                  aria-expanded={active && item.content !== undefined ? expanded : undefined}
                  tabIndex={active ? 0 : -1}
                  className={TAB_BUTTON}
                  onClick={() => handleTabClick(index)}
                >
                  <TabIcon icon={item.icon} scale={pill.pops[index]} />
                </button>
              )
            })}
          </div>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 bg-primary"
            style={pill.indicator}
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex gap-1 text-primary-foreground"
            style={{ clipPath: pill.clipPath }}
          >
            {items.map((item, index) => (
              <span key={item.value} className="grid size-14 shrink-0 place-items-center">
                <TabIcon icon={item.icon} scale={pill.pops[index]} />
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
