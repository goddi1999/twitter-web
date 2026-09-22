import { useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'

import { cn } from '@/lib/utils'

import { DEFAULT_PLACES, PIN_ITEM_SPRING } from './pin-item.constants'
import type { PinnedPlacesListProps, PlaceItem } from './pin-item.types'
import { PlaceCard } from './PlaceCard'

export function PinnedPlacesList({
  items = DEFAULT_PLACES,
  pinnedTitle = 'Pinned Places',
  allTitle = 'All Places',
  onPinnedChange,
  className,
}: PinnedPlacesListProps) {
  const [places, setPlaces] = useState<PlaceItem[]>(() =>
    items.map((place) => ({ ...place, pinned: place.pinned ?? false })),
  )

  const pinnedPlaces = places.filter((place) => place.pinned)
  const unpinnedPlaces = places.filter((place) => !place.pinned)

  const handleTogglePin = (id: string) => {
    const updated = places.map((place) =>
      place.id === id ? { ...place, pinned: !place.pinned } : place,
    )
    setPlaces(updated)
    onPinnedChange?.(
      updated.filter((place) => place.pinned).map((place) => place.id),
    )
  }

  return (
    <div className={cn('w-full max-w-[355px] space-y-6', className)}>
      <MotionConfig transition={PIN_ITEM_SPRING}>
        <AnimatePresence mode="popLayout" initial={false}>
          {pinnedPlaces.length > 0 && (
            <motion.section
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <motion.h3
                layout
                className="ml-1 text-[14px] font-semibold tracking-wider text-[#ADACB8] dark:text-neutral-500"
              >
                {pinnedTitle}
              </motion.h3>
              <div className="space-y-2">
                {pinnedPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <motion.section layout className="space-y-3">
          <motion.h3
            layout
            className="ml-1 text-[14px] font-semibold tracking-wider text-[#ADACB8] dark:text-neutral-500"
          >
            {allTitle}
          </motion.h3>
          <div className="space-y-3">
            {unpinnedPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        </motion.section>
      </MotionConfig>
    </div>
  )
}
