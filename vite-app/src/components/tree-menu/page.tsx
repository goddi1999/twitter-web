import { DemoPage } from '../demo-page'

import { TreeMenu } from './TreeMenu'
import type { MenuItem } from './tree-menu.types'

const MENU: MenuItem[] = [
  {
    id: 'design',
    label: 'Design',
    children: [
      {
        id: 'foundations',
        label: 'Foundations',
        children: [
          { id: 'colour', label: 'Colour' },
          { id: 'type', label: 'Typography' },
          { id: 'spacing', label: 'Spacing' },
        ],
      },
      {
        id: 'components',
        label: 'Components',
        children: [
          { id: 'buttons', label: 'Buttons' },
          { id: 'inputs', label: 'Inputs' },
          { id: 'overlays', label: 'Overlays' },
        ],
      },
      { id: 'motion', label: 'Motion' },
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    children: [
      { id: 'architecture', label: 'Architecture' },
      { id: 'testing', label: 'Testing' },
      { id: 'release', label: 'Release process' },
    ],
  },
  { id: 'changelog', label: 'Changelog' },
  { id: 'support', label: 'Support' },
]

export function TreeMenuPage() {
  return (
    <DemoPage
      eyebrow="shared / tree-menu"
      title="Tree menu"
      description="A drill-down menu where the row you pick becomes the breadcrumb above the next level. Rows above the clicked one exit upward and rows below exit downward, so the list parts around your choice."
      align="start"
    >
      <TreeMenu items={MENU} />
    </DemoPage>
  )
}
