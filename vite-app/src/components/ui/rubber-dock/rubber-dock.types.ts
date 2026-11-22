import type { ComponentProps, ReactNode } from 'react'

export type RubberDockItem = {
  /** Unique value for this tab. */
  value: string
  /** Accessible name; the tab only shows its icon. */
  label: string
  /** Rendered at 22px, once in the muted row and once inverted inside the pill. */
  icon: ReactNode
  /**
   * What the dock opens into when the active tab is clicked again. Each top-level
   * child (fragments are flattened) staggers in. Omit for a tab that only selects.
   */
  content?: ReactNode
}

export type RubberDockProps = Omit<
  ComponentProps<'div'>,
  'children' | 'defaultValue' | 'onChange'
> & {
  /** The tabs, left to right. */
  items: readonly RubberDockItem[]
  /** Controlled active tab. */
  value?: string
  /** Starting tab when uncontrolled. @default the first item */
  defaultValue?: string
  /** Called when a click, drag or arrow key picks another tab. */
  onValueChange?: (value: string) => void
  /** Controlled open state: the dock morphed into the active tab's card. */
  open?: boolean
  /** Starting open state when uncontrolled. @default false */
  defaultOpen?: boolean
  /** Called when the active tab is clicked again, on Escape and on a click outside. */
  onOpenChange?: (open: boolean) => void
  /** Card width in px when open; never wider than the viewport minus 24px. @default 340 */
  expandedWidth?: number
}
