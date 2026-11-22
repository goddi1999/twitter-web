import { LogOut } from 'lucide-react'

import { AdminSignInForm, useAdminSession } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { DemoPage } from '../demo-page'

import { AdminPostList } from './AdminPostList'
import { CreatePostComposer } from './CreatePostComposer'
import { useFeed } from './use-feed'

/** Signed-in view: write on top, every post to manage below, split by a separator. */
function AdminWorkspace({ onSignOut }: { onSignOut: () => void }) {
  const feed = useFeed()

  return (
    <>
      {/* publishing stays here and refreshes the list, so the new post shows at the top */}
      <CreatePostComposer onPublished={feed.reload} />
      <div className="flex w-full max-w-xl items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          Signed in as <span className="font-medium text-foreground">admin</span>
        </span>
        <Button
          type="button"
          variant="ghost"
          onClick={onSignOut}
          className="h-11 rounded-full px-4 text-muted-foreground hover:text-foreground"
        >
          <LogOut />
          Sign out
        </Button>
      </div>

      <Separator className="my-4 max-w-xl" />

      <AdminPostList feed={feed} />
    </>
  )
}

/** Writing is admin-only: signed out, the page is just the sign-in form. */
export function CreatePostPage() {
  const { isAdmin, signOut } = useAdminSession()

  return (
    <DemoPage title="Create post" align="center" className="max-w-3xl gap-4 pt-4 sm:gap-8 sm:pt-10">
      <div className="flex w-full flex-col items-center gap-3 pb-24">
        {isAdmin ? <AdminWorkspace onSignOut={signOut} /> : <AdminSignInForm />}
      </div>
    </DemoPage>
  )
}
