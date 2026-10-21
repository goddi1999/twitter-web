import { useState, type ReactNode } from 'react'
import { ArrowLeft, BookOpen, Menu, Network, RefreshCw } from 'lucide-react'

import { DocsCodeBlock, DocsPage } from '@/components/docs'
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
    description: 'Course materials and exercises — coming soon.',
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

const APP_CJS = `const express = require('express');
const app = express();
const port = 3000;
const host = '127.0.0.1';

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, host, () => {
  console.log(\`Example app listening at http://\${host}:\${port}/\`);
});`

const INSTALL_COMMANDS = `# Node.js 20 LTS (or newer) — check with: node -v
# Example: v20.18.0

mkdir hello-express && cd hello-express
npm init -y
npm install express

# save the file as app.cjs, then:
node app.cjs`

const TERMINAL_OUTPUT = `Example app listening at http://127.0.0.1:3000/`

const POSTMAN_ASCII = `┌─ Postman ─────────────────────────────────────────┐
│  GET  http://127.0.0.1:3000/                      │
├───────────────────────────────────────────────────┤
│  Status   200 OK                                  │
│  Time     ~5 ms                                   │
│  Size     12 B                                    │
├─ Headers ─────────────────────────────────────────┤
│  Content-Type: text/html; charset=utf-8           │
│  Content-Length: 12                               │
│  Connection: keep-alive                           │
│  Keep-Alive: timeout=5                            │
│  X-Powered-By: Express                            │
├─ Body (raw / Text) ───────────────────────────────┤
│                                                   │
│  Hello World!                                     │
│                                                   │
│  return type: string  (text/html, not JSON)       │
│                                                   │
└───────────────────────────────────────────────────┘`

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
            Express hello-world: install, run, and inspect the response.
          </p>
        </header>

        <ul className="flex list-none flex-col gap-4 p-0">
          <li>
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>What you need before starting.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <span className="text-foreground font-medium">Node.js 20 LTS</span> or
                    newer (<code className="font-mono text-xs">node -v</code> → e.g.{' '}
                    <code className="font-mono text-xs">v20.18.0</code>)
                  </li>
                  <li>
                    <span className="text-foreground font-medium">npm</span> (comes with
                    Node)
                  </li>
                  <li>
                    Package: <code className="font-mono text-xs">express</code>
                  </li>
                  <li>Optional: Postman (or browser / curl) to call the endpoint</li>
                </ul>
              </CardContent>
            </Card>
          </li>

          <li>
            <Card>
              <CardHeader>
                <CardTitle>Install &amp; run</CardTitle>
                <CardDescription>Create the project, install Express, start the server.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <DocsCodeBlock title="terminal" language="bash" code={INSTALL_COMMANDS} />
                <DocsCodeBlock
                  title="server console (after node app.cjs)"
                  language="bash"
                  code={TERMINAL_OUTPUT}
                />
              </CardContent>
            </Card>
          </li>

          <li>
            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-base">app.cjs</CardTitle>
                <CardDescription>Minimal Express hello-world server.</CardDescription>
              </CardHeader>
              <CardContent>
                <DocsCodeBlock title="app.cjs" language="bash" code={APP_CJS} />
              </CardContent>
            </Card>
          </li>

          <li>
            <Card>
              <CardHeader>
                <CardTitle>Postman — what you see</CardTitle>
                <CardDescription>
                  GET / returns a plain string body (text/html), not JSON.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocsCodeBlock title="Postman response (ASCII)" language="bash" code={POSTMAN_ASCII} />
              </CardContent>
            </Card>
          </li>
        </ul>
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
