import { DemoPage } from '../demo-page'

import { CreatePostComposer } from './CreatePostComposer'
import type { Post } from './post.model'

type CreatePostPageProps = {
  onPublished?: (post: Post) => void
}

export function CreatePostPage({ onPublished }: CreatePostPageProps) {
  return (
    <DemoPage
      title="Create post"
      align="center"
      className="max-w-3xl gap-4 pt-4 sm:gap-8 sm:pt-10"
    >
      <div className="flex w-full justify-center pb-24">
        <CreatePostComposer onPublished={onPublished} />
      </div>
    </DemoPage>
  )
}
