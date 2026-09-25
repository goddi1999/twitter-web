import { DemoPage } from '../demo-page'

import { PostFeed } from './PostFeed'

export function PostPage() {
  return (
    <DemoPage
      eyebrow="shared / post"
      title="Post"
      description="Reusable feed cards and a thread Sheet. Like increments on the Post model; open a card to read comments."
      align="center"
    >
      <div className="mx-auto w-full max-w-xl pb-24 text-left">
        <PostFeed />
      </div>
    </DemoPage>
  )
}
