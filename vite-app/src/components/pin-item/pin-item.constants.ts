import type { Transition } from 'motion/react'
import {
  BatteryCharging,
  Coffee,
  Pill,
  Sailboat,
  Utensils,
} from 'lucide-react'

import type { PlaceItem } from './pin-item.types'

export const PIN_ITEM_SPRING: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 40,
}

export const DEFAULT_PLACES: PlaceItem[] = [
  {
    id: 'harbor-bay-marina',
    name: 'Harbor Bay Marina',
    type: 'Marina',
    status: 'Closes 7:00 PM',
    icon: Sailboat,
  },
  {
    id: 'mocha-brew',
    name: 'Mocha Brew',
    type: 'Cafe',
    status: 'Closes 9:00 PM',
    icon: Coffee,
  },
  {
    id: 'olive-bistro',
    name: 'Olive Bistro',
    type: 'Restaurant',
    status: 'Closes 11:00 PM',
    icon: Utensils,
  },
  {
    id: 'greenvolt-hub',
    name: 'GreenVolt Hub',
    type: 'EV Charger',
    status: 'Open 24 hours',
    icon: BatteryCharging,
  },
  {
    id: 'careplus-pharmacy',
    name: 'CarePlus Pharmacy',
    type: 'Pharmacy',
    status: 'Open 24 hours',
    icon: Pill,
  },
]
