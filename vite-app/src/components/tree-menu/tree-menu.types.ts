export type MenuItem = {
  id: string
  label: string
  children?: MenuItem[]
}

export type TreeMenuProps = {
  items: MenuItem[]
  /** Fires when a leaf (an item with no children) is chosen. */
  onSelect?: (item: MenuItem) => void
  className?: string
}
