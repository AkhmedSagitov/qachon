import { EventSlot, Restaurant,EventType } from '@/generated/prisma'

// Event slot with relations
export type EventSlotWithRelations = EventSlot & {
  restaurant: Restaurant
}

// Event slot form data
export type EventSlotFormData = {
  restaurantId: string
  date: Date
  startTime: string
  endTime: string
  capacity: number
  price: number
  eventType?: EventType
  description?: string
  isAvailable?: boolean
}

// Bulk slot creation
export type BulkSlotFormData = {
  restaurantId: string
  dateFrom: Date
  dateTo: Date
  timeSlots: {
    startTime: string
    endTime: string
    price: number
  }[]
  capacity: number
  eventType?: EventType
  daysOfWeek?: number[] // 0-6 (Sunday-Saturday)
}

// Calendar slot data
export type CalendarSlot = {
  date: Date
  slots: EventSlot[]
  availableCount: number
  bookedCount: number
}
