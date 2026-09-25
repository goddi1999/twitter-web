import { useState } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { TreeMenu, type MenuItem } from "@/components/tree-menu"
import { PostPage } from "@/components/post"

const NAV_ITEMS: MenuItem[] = [
  { id: "home", label: "Home" },
  { id: "docs", label: "Docs" },
]

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="absolute top-4 right-4 z-10">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
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
              onSelect={() => setMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <PostPage />
    </div>
  )
}

export default App
