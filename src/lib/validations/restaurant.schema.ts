import { z } from "zod"
import { content } from "@/content/text.content"

export const restaurantSchema = z.object({
  name: z.string({ message: content.validation.nameRequired })
    .min(3, content.validation.nameMin(3))
    .max(100, content.validation.nameMax(100)),

  description: z.string()
    .max(2000, content.validation.descriptionMax)
    .or(z.literal(""))
    .optional(),

  address: z.string({ message: content.validation.addressRequired })
    .min(5, content.validation.addressMin),

  city: z.string({ message: content.validation.cityRequired })
    .min(2, content.validation.cityMin),

  regionId: z.string({ message: content.validation.regionRequired })
    .uuid(content.validation.regionInvalid),

  phone: z.string()
    .regex(/^\+?[0-9\s\-\(\)]{10,20}$/, content.validation.phoneFormat)
    .or(z.literal(""))
    .optional(),

  email: z.string()
    .email(content.validation.emailFormat)
    .or(z.literal(""))
    .optional(),

  website: z.string()
    .url(content.validation.urlInvalid)
    .or(z.literal(""))
    .optional(),

  capacity: z.number({ message: content.validation.capacityRequired })
    .int(content.validation.capacityInteger)
    .min(10, content.validation.capacityMin(10))
    .max(1000, content.validation.capacityMax(1000)),

  pricePerHour: z.number({ message: content.validation.priceRequired })
    .min(0, content.validation.priceNonNegative)
    .max(1000000, content.validation.priceMax),

  latitude: z.number()
    .min(-90, content.validation.latitudeRange)
    .max(90, content.validation.latitudeRange)
    .optional(),

  longitude: z.number()
    .min(-180, content.validation.longitudeRange)
    .max(180, content.validation.longitudeRange)
    .optional(),
})

export type RestaurantSchemaType = z.infer<typeof restaurantSchema>
