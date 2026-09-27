import { useState } from 'react'
import { Menu, RefreshCw } from 'lucide-react'

import { DocsPage } from '@/components/docs'
import { CreatePostPage, PostPage } from '@/components/post'
import { ThemeModeToggle } from '@/components/ThemeModeToggle'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { TreeMenu, type MenuItem } from '@/components/tree-menu'
import { useAccentTheme } from '@/components/use-accent-theme'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_ITEMS: MenuItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'create', label: 'Create post' },
  { id: 'docs', label: 'Docs' },
]

type AppView = 'home' | 'create' | 'docs'

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [view, setView] = useState<AppView>('home')
  const [feedKey, setFeedKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  // Apply accent from themes.ts (`data-accent` → CSS primary tokens)
  useAccentTheme()

  function handleRefresh() {
    setRefreshing(true)
    setFeedKey((key) => key + 1)
    window.setTimeout(() => setRefreshing(false), 400)
  }

  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {view === 'home' ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Refresh posts"
            onClick={handleRefresh}
            className="h-10 w-10 rounded-full bg-background/80 shadow-sm backdrop-blur-sm"
          >
            <RefreshCw className={cn('size-5', refreshing && 'animate-spin')} />
          </Button>
        ) : null}
        <ThemeModeToggle />
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="h-10 w-10 rounded-full bg-background/80 shadow-sm backdrop-blur-sm"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col">
              <TreeMenu
                items={NAV_ITEMS}
                className="min-h-0 flex-1 justify-start pt-4 pb-4"
                onSelect={(item) => {
                  if (item.id === 'home' || item.id === 'create' || item.id === 'docs') {
                    setView(item.id)
                  }
                  setMenuOpen(false)
                }}
              />
              <div className="mt-auto border-t border-border/60 px-4 py-4">
                <ThemeSwitcher />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {view === 'create' ? (
        <CreatePostPage onPublished={() => setView('home')} />
      ) : view === 'docs' ? (
        <DocsPage />
      ) : (
        <PostPage key={feedKey} />
      )}
    </div>
  )
}

export default App
