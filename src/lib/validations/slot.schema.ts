import { z } from "zod"
import { EventType } from "@/generated/prisma"
import { content } from "@/content/text.content"

export const eventSlotSchema = z.object({
  restaurantId: z.string({ message: content.validation.restaurantRequired }),
  date: z.date({ message: content.validation.dateRequired }),
  startTime: z.string({ message: content.validation.startTimeRequired })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, content.validation.timeFormat),
  endTime: z.string({ message: content.validation.endTimeRequired })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, content.validation.timeFormat),
  capacity: z.number({ message: content.validation.capacityRequired })
    .min(1, content.validation.capacityMinSingle),
  eventType: z.nativeEnum(EventType).optional(),
  price: z.number({ message: content.validation.priceRequired })
    .min(0, content.validation.priceNonNegative),
})

export const bulkSlotSchema = z.object({
  restaurantId: z.string({ message: content.validation.restaurantRequired }),
  dateFrom: z.date({ message: content.validation.startDateRequired }),
  dateTo: z.date({ message: content.validation.endDateRequired }),
  timeSlots: z.array(z.object({
    startTime: z.string({ message: content.validation.startTimeRequired })
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, content.validation.timeFormat),
    endTime: z.string({ message: content.validation.endTimeRequired })
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, content.validation.timeFormat),
    price: z.number({ message: content.validation.priceRequired })
      .min(0, content.validation.priceNonNegative),
  })).min(1, content.validation.timeSlotRequired),
  capacity: z.number({ message: content.validation.capacityRequired })
    .min(1, content.validation.capacityMinSingle),
  eventType: z.nativeEnum(EventType).optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
}).refine(
  (data) => data.dateTo >= data.dateFrom,
  {
    message: content.validation.dateRangeInvalid,
    path: ["dateTo"],
  }
)

export type EventSlotSchemaType = z.infer<typeof eventSlotSchema>
export type BulkSlotSchemaType = z.infer<typeof bulkSlotSchema>
