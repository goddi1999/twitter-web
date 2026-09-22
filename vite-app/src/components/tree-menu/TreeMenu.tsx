import { useRef, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { CornerUpLeft } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { MenuItem, TreeMenuProps } from './tree-menu.types'

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: {},
}

export function TreeMenu({ items, onSelect, className }: TreeMenuProps) {
  const [path, setPath] = useState<MenuItem[]>([])
  const [activeItemId, setActiveItemId] = useState<string | null>(null)

  // Read while the exit animation runs, so it has to be a ref rather than
  // state: rows above the clicked one fly up, rows below fly down.
  const clickedIndexRef = useRef<number | null>(null)

  const currentParent = path[path.length - 1]
  const currentItems = currentParent ? (currentParent.children ?? []) : items
  const listKey = currentParent?.id ?? 'root'

  const itemVariants: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: (index: number) => {
      const clickedIndex = clickedIndexRef.current
      if (clickedIndex === null) {
        return { opacity: 0, y: -10, transition: { duration: 0.2 } }
      }
      if (index === clickedIndex) {
        return { opacity: 0, transition: { duration: 0.2 } }
      }
      return {
        opacity: 0,
        y: index < clickedIndex ? -100 : 100,
        transition: { duration: 0.3, ease: 'easeOut' },
      }
    },
  }

  const handleSelectItem = (item: MenuItem, index: number) => {
    if (item.children?.length) {
      clickedIndexRef.current = index
      setPath((prev) => [...prev, item])
      setActiveItemId(null)
      return
    }

    setActiveItemId(item.id)
    onSelect?.(item)
  }

  const handleNavigateBack = (depth: number) => {
    clickedIndexRef.current = null
    setPath((prev) => prev.slice(0, depth))
  }

  return (
    <div
      className={cn(
        'flex min-h-full w-full flex-col items-center justify-center overflow-x-hidden pt-12 pb-20',
        className,
      )}
    >
      <div className="flex min-h-100 w-full max-w-lg flex-col px-6 sm:px-10">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-col items-start space-y-1">
          <AnimatePresence mode="popLayout">
            {path.map((item, depth) => (
              <motion.button
                key={`crumb-${item.id}`}
                type="button"
                layout="position"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5, transition: { duration: 0.4 } }}
                onClick={() => handleNavigateBack(depth)}
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-xl font-semibold text-neutral-400 transition-colors hover:bg-neutral-100 sm:text-2xl dark:text-neutral-500 dark:hover:bg-neutral-800"
                style={{ marginLeft: `${depth * 12}px` }}
              >
                <CornerUpLeft className="size-5" />
                <motion.span
                  layoutId={`tree-menu-label-${item.id}`}
                  className="inline-block max-w-50 truncate sm:max-w-xs"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            ))}
          </AnimatePresence>
        </nav>

        <div className="relative">
          <AnimatePresence mode="popLayout">
            <motion.ul
              key={listKey}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex w-full flex-col items-start space-y-1"
              style={{ paddingLeft: `${path.length * 16}px` }}
            >
              {currentItems.map((item, index) => {
                const hasChildren = Boolean(item.children?.length)
                const isActive = activeItemId === item.id

                return (
                  <motion.li
                    key={item.id}
                    custom={index}
                    variants={itemVariants}
                    className="w-full"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectItem(item, index)}
                      aria-current={isActive}
                      className={cn(
                        'w-full rounded-xl px-4 py-3 text-left text-xl font-semibold transition-all duration-200 sm:text-2xl',
                        hasChildren
                          ? 'text-neutral-900 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-300'
                          : isActive
                            ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-200',
                      )}
                    >
                      <motion.span
                        layoutId={
                          hasChildren ? `tree-menu-label-${item.id}` : undefined
                        }
                        className="inline-block"
                      >
                        {item.label}
                      </motion.span>
                    </button>
                  </motion.li>
                )
              })}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
