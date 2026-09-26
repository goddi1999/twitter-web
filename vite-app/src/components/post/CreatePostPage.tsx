import { DemoPage } from '../demo-page'

import { CreatePostComposer } from './CreatePostComposer'
import type { Post } from './post.model'

type CreatePostPageProps = {
  onPublished?: (post: Post) => void
}

export function CreatePostPage({ onPublished }: CreatePostPageProps) {
  return (
    <DemoPage
      eyebrow="shared / post"
      title="Create post"
      description="Compose a post. Author and avatar are assigned by the server (or locally when the API is offline)."
      align="center"
      className="max-w-3xl"
    >
      <div className="flex w-full justify-center pb-24">
        <CreatePostComposer onPublished={onPublished} />
      </div>
    </DemoPage>
  )
}
