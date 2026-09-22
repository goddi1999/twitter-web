import { motion } from 'motion/react'
import { Pin } from 'lucide-react'

import { cn } from '@/lib/utils'

import { PIN_ITEM_SPRING } from './pin-item.constants'
import type { PlaceItem } from './pin-item.types'

type PlaceCardProps = {
  place: PlaceItem
  onTogglePin: (id: string) => void
}

export function PlaceCard({ place, onTogglePin }: PlaceCardProps) {
  const Icon = place.icon

  return (
    <motion.div
      layoutId={`pin-item-card-${place.id}`}
      transition={PIN_ITEM_SPRING}
      className="group relative flex cursor-default items-center justify-between gap-2.5 rounded-2xl border border-gray-100 bg-[#F6F5FA] p-2.5 shadow-xs transition-shadow hover:shadow-sm sm:p-3 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-center gap-3">
        <motion.div
          layout
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEFEFE] text-[#AEADB9] dark:bg-neutral-800 dark:text-neutral-400"
        >
          <Icon className="size-5.5" />
        </motion.div>

        <motion.div layout>
          <h4 className="text-base leading-tight font-bold text-[#27272B] dark:text-neutral-100">
            {place.name}
          </h4>
          <p className="mt-0.5 max-w-[180px] truncate text-[14px] font-semibold text-[#87868D] sm:max-w-none dark:text-neutral-400">
            {place.type} • {place.status}
          </p>
        </motion.div>
      </div>

      <motion.button
        layout
        type="button"
        aria-pressed={place.pinned}
        aria-label={place.pinned ? `Unpin ${place.name}` : `Pin ${place.name}`}
        onClick={() => onTogglePin(place.id)}
        className={cn(
          'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
          place.pinned
            ? 'bg-yellow-400 text-white opacity-100'
            : 'bg-[#CDCCD5] text-[#fefefe] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 dark:bg-neutral-700 dark:text-neutral-400',
        )}
      >
        <Pin className="size-4 fill-current" />
      </motion.button>
    </motion.div>
  )
}
