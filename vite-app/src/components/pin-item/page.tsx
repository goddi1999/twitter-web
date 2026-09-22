import { DemoPage } from '../demo-page'

import { PinnedPlacesList } from './PinnedPlacesList'

export function PinItemPage() {
  return (
    <DemoPage
      eyebrow="shared / pin-item"
      title="Pin item"
      description="Pinning a place moves its card between two lists. Because each card carries a shared layout id, it travels to its new section rather than disappearing from one and reappearing in the other."
      align="start"
    >
      <div className="pb-24">
        <PinnedPlacesList />
      </div>
    </DemoPage>
  )
}
