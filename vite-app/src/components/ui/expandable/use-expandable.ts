import { createContext, useContext } from 'react'

import type { ExpandableContextValue } from './expandable.types'

export const ExpandableContext = createContext<ExpandableContextValue>({
  isExpanded: false,
  toggleExpand: () => {},
  expandDirection: 'vertical',
  expandBehavior: 'replace',
  transitionDuration: 0.3,
  easeType: 'easeInOut',
  initialDelay: 0,
  reducedMotion: false,
})

export function useExpandable() {
  return useContext(ExpandableContext)
}
