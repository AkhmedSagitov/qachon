import { Restaurant, RestaurantImage, EventSlot, Region, User } from '@/generated/prisma'

// Restaurant with relations
export type RestaurantWithRelations = Restaurant & {
  owner: User
  region: Region
  images: RestaurantImage[]
  eventSlots?: EventSlot[]
}

// Restaurant with basic info (for lists/cards)
export type RestaurantBasic = Restaurant & {
  region: Region
  images: RestaurantImage[]
  _count?: {
    eventSlots: number
  }
}

// Serialized Restaurant (Decimal -> number for client)
export type SerializedRestaurantBasic = Omit<RestaurantBasic, 'pricePerHour'> & {
  pricePerHour: number
}

// Restaurant form data
export type RestaurantFormData = {
  name: string
  description?: string
  address: string
  city: string
  regionId: string
  phone?: string
  email?: string
  website?: string
  capacity: number
  pricePerHour: number
  latitude?: number
  longitude?: number
}

// Restaurant stats
export type RestaurantStats = {
  totalSlots: number
}
