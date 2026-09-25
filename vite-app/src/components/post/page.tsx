import { DemoPage } from '../demo-page'

import { PostFeed } from './PostFeed'

export function PostPage() {
  return (
    <DemoPage
      eyebrow="shared / post"
      title="Post"
      description="Fixed-width cards in a responsive grid. Text clamps at four lines with Expand; scroll for more."
      align="center"
      className="max-w-7xl"
    >
      <div className="w-full pb-24">
        <PostFeed />
      </div>
    </DemoPage>
  )
}
