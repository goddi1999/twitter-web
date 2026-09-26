import { useState } from 'react'
import { Menu } from 'lucide-react'

import { DocsPage } from '@/components/docs'
import { CreatePostPage, PostPage } from '@/components/post'
import { TreeMenu, type MenuItem } from '@/components/tree-menu'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const NAV_ITEMS: MenuItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'create', label: 'Create post' },
  { id: 'docs', label: 'Docs' },
]

type AppView = 'home' | 'create' | 'docs'

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [view, setView] = useState<AppView>('home')

  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="fixed top-4 right-4 z-50">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="bg-background/80 shadow-sm backdrop-blur-sm"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <TreeMenu
              items={NAV_ITEMS}
              className="min-h-0 justify-start pt-4 pb-8"
              onSelect={(item) => {
                if (item.id === 'home' || item.id === 'create' || item.id === 'docs') {
                  setView(item.id)
                }
                setMenuOpen(false)
              }}
            />
          </SheetContent>
        </Sheet>
      </div>

      {view === 'create' ? (
        <CreatePostPage onPublished={() => setView('home')} />
      ) : view === 'docs' ? (
        <DocsPage />
      ) : (
        <PostPage />
      )}
    </div>
  )
}

export default App
