import { useState, type ReactNode } from 'react'
import { ArrowLeft, BookOpen, Menu, Network, RefreshCw } from 'lucide-react'

import { OrderServiceGuide } from '@/components/distributed'
import { DocsPage } from '@/components/docs'
import { CreatePostPage, PostPage } from '@/components/post'
import { ThemeModeToggle } from '@/components/ThemeModeToggle'
import { TreeMenu, type MenuItem } from '@/components/tree-menu'
import { UsefulCommandsPage } from '@/components/useful-commands'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type CourseId = 'fortgeschrittene' | 'distributed'
type FpView = 'home' | 'create' | 'docs' | 'useful-commands'

const FP_NAV_ITEMS: MenuItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'create', label: 'Create post' },
  { id: 'docs', label: 'Docs' },
  { id: 'useful-commands', label: 'Useful commands' },
]

const COURSES: {
  id: CourseId
  title: string
  description: string
  icon: typeof BookOpen
}[] = [
  {
    id: 'fortgeschrittene',
    title: 'Fortgeschrittene Programmierung',
    description: 'Posts, publish flow, and API docs for the social client.',
    icon: BookOpen,
  },
  {
    id: 'distributed',
    title: 'Distributed Systems',
    description: 'Stock Order Service exercise (0010) in English and German.',
    icon: Network,
  },
]

function FloatingActions({ children }: { children: ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">{children}</div>
  )
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={onClick}
      className="h-10 w-10 rounded-full bg-background/80 shadow-sm backdrop-blur-sm"
    >
      {children}
    </Button>
  )
}

function CourseHome({ onSelect }: { onSelect: (id: CourseId) => void }) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Courses
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Choose a course</h1>
        <p className="text-muted-foreground text-sm">
          Pick a module to open its materials and tools.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {COURSES.map(({ id, title, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="group text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
          >
            <Card className="h-full transition-colors group-hover:bg-muted/40 group-hover:ring-foreground/10">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-muted">
                  <Icon className="size-5 text-foreground" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                  Open →
                </span>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </main>
  )
}

function DistributedSystemsPage({ onBack }: { onBack: () => void }) {
  return (
    <>
      <FloatingActions>
        <IconButton label="Back to courses" onClick={onBack}>
          <ArrowLeft className="size-5" />
        </IconButton>
        <ThemeModeToggle />
      </FloatingActions>
      <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-6 px-6 py-16">
        <header className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Course
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Distributed Systems</h1>
          <p className="text-muted-foreground text-sm">
            Stock Order Service — exercise 0010 (EN / DE).
          </p>
        </header>

        <OrderServiceGuide />
      </main>
    </>
  )
}

function FortgeschritteneApp({ onBack }: { onBack: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [view, setView] = useState<FpView>('home')
  const [feedKey, setFeedKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    setFeedKey((key) => key + 1)
    window.setTimeout(() => setRefreshing(false), 400)
  }

  return (
    <>
      <FloatingActions>
        <IconButton label="Back to courses" onClick={onBack}>
          <ArrowLeft className="size-5" />
        </IconButton>
        {view === 'home' ? (
          <IconButton label="Refresh posts" onClick={handleRefresh}>
            <RefreshCw className={cn('size-5', refreshing && 'animate-spin')} />
          </IconButton>
        ) : null}
        <ThemeModeToggle />
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <IconButton label="Open menu">
              <Menu className="size-5" />
            </IconButton>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Fortgeschrittene Programmierung</SheetTitle>
            </SheetHeader>
            <TreeMenu
              items={FP_NAV_ITEMS}
              className="min-h-0 flex-1 justify-start pt-4 pb-4"
              onSelect={(item) => {
                if (
                  item.id === 'home' ||
                  item.id === 'create' ||
                  item.id === 'docs' ||
                  item.id === 'useful-commands'
                ) {
                  setView(item.id)
                }
                setMenuOpen(false)
              }}
            />
          </SheetContent>
        </Sheet>
      </FloatingActions>

      {view === 'create' ? (
        <CreatePostPage onPublished={() => setView('home')} />
      ) : view === 'docs' ? (
        <DocsPage />
      ) : view === 'useful-commands' ? (
        <UsefulCommandsPage />
      ) : (
        <PostPage key={feedKey} />
      )}
    </>
  )
}

export function App() {
  const [course, setCourse] = useState<CourseId | null>(null)

  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      {course === null ? (
        <>
          <FloatingActions>
            <ThemeModeToggle />
          </FloatingActions>
          <CourseHome onSelect={setCourse} />
        </>
      ) : course === 'fortgeschrittene' ? (
        <FortgeschritteneApp onBack={() => setCourse(null)} />
      ) : (
        <DistributedSystemsPage onBack={() => setCourse(null)} />
      )}
    </div>
  )
}

export default App
