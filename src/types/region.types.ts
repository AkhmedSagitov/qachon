import { Region, Restaurant } from '@/generated/prisma'

// Region with restaurant count
export type RegionWithCount = Region & {
  _count: {
    restaurants: number
  }
}

// Region with restaurants
export type RegionWithRestaurants = Region & {
  restaurants: Restaurant[]
}
