"use server";

import prisma from "@/utils/prisma";
import { eventSlotSchema, bulkSlotSchema } from "@/lib/validations/slot.schema";
import { EventSlotFormData, BulkSlotFormData } from "@/types/slot.types";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth/auth";
import { UserRole } from "@/generated/prisma";
import { content } from "@/content/text.content";

export async function getAvailableSlots(restaurantId: string, month?: Date) {
  try {
    const startDate = month || new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const slots = await prisma.eventSlot.findMany({
      where: {
        restaurantId,
        date: {
          gte: startDate,
          lt: endDate,
        },
        isAvailable: true,
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    // Convert Decimal to Number and Date to string for client components
    const serializedSlots = slots.map(slot => ({
      ...slot,
      price: Number(slot.price),
      startTime: slot.startTime.toISOString().substring(11, 16), // Extract HH:mm
      endTime: slot.endTime.toISOString().substring(11, 16), // Extract HH:mm
    }));

    return { success: true, slots: serializedSlots };
  } catch (error) {
    console.error("Error fetching slots:", error);
    return { error: content.slot.loadError };
  }
}

export async function getRestaurantSlots(restaurantId: string, userId: string) {
  // Verify authentication
  const session = await auth();
  if (!session || !session.user) {
    return { error: content.auth.authRequired };
  }

  // Verify user matches the provided userId
  if (session.user.id !== userId) {
    return { error: content.auth.noAccess };
  }

  try {
    // Check ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { ownerId: true },
    });

    if (!restaurant || restaurant.ownerId !== userId) {
      return { error: content.slot.noViewPermission };
    }

    const slots = await prisma.eventSlot.findMany({
      where: {
        restaurantId,
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    // Convert Decimal to Number and Date to string for client components
    const serializedSlots = slots.map(slot => ({
      ...slot,
      price: Number(slot.price),
      startTime: slot.startTime.toISOString().substring(11, 16), // Extract HH:mm
      endTime: slot.endTime.toISOString().substring(11, 16), // Extract HH:mm
    }));

    return { success: true, slots: serializedSlots };
  } catch (error) {
    console.error("Error fetching restaurant slots:", error);
    return { error: content.slot.loadError };
  }
}

export async function createEventSlot(data: EventSlotFormData, userId: string) {
  // Verify authentication
  const session = await auth();
  if (!session || !session.user) {
    return { error: content.auth.authRequired };
  }

  // Verify user matches the provided userId
  if (session.user.id !== userId) {
    return { error: content.auth.noAccess };
  }

  const validation = eventSlotSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || content.validation.validationError,
    };
  }

  try {
    // Check ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: data.restaurantId },
      select: { ownerId: true, slug: true, capacity: true },
    });

    if (!restaurant || restaurant.ownerId !== userId) {
      return { error: content.slot.noCreatePermission };
    }

    // Convert time strings to Date objects
    const [startHour, startMinute] = validation.data.startTime.split(":").map(Number);
    const [endHour, endMinute] = validation.data.endTime.split(":").map(Number);

    const startTime = new Date(1970, 0, 1, startHour, startMinute);
    const endTime = new Date(1970, 0, 1, endHour, endMinute);

    const slot = await prisma.eventSlot.create({
      data: {
        restaurantId: validation.data.restaurantId,
        date: validation.data.date,
        startTime,
        endTime,
        capacity: validation.data.capacity || restaurant.capacity,
        price: validation.data.price,
        eventType: validation.data.eventType || null,
        isAvailable: true,
      },
    });

    revalidatePath(`/restaurant/${restaurant.slug}`);
    revalidatePath("/owner/slots");

    // Convert Decimal to Number for client components
    const serializedSlot = {
      ...slot,
      price: Number(slot.price),
    };

    return { success: true, slot: serializedSlot };
  } catch (error) {
    console.error("Error creating slot:", error);
    return { error: content.slot.createError };
  }
}

export async function createBulkSlots(data: BulkSlotFormData, userId: string) {
  // Verify authentication
  const session = await auth();
  if (!session || !session.user) {
    return { error: content.auth.authRequired };
  }

  // Verify user matches the provided userId
  if (session.user.id !== userId) {
    return { error: content.auth.noAccess };
  }

  const validation = bulkSlotSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || content.validation.validationError,
    };
  }

  try {
    // Check ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: data.restaurantId },
      select: { ownerId: true, slug: true },
    });

    if (!restaurant || restaurant.ownerId !== userId) {
      return { error: content.slot.noCreatePermission };
    }

    const slots = [];
    const currentDate = new Date(data.dateFrom);
    const endDate = new Date(data.dateTo);

    while (currentDate <= endDate) {
      // Check if day of week matches (if specified)
      if (
        !data.daysOfWeek ||
        data.daysOfWeek.length === 0 ||
        data.daysOfWeek.includes(currentDate.getDay())
      ) {
        for (const timeSlot of data.timeSlots) {
          const [startHour, startMinute] = timeSlot.startTime.split(":").map(Number);
          const [endHour, endMinute] = timeSlot.endTime.split(":").map(Number);

          const startTime = new Date(1970, 0, 1, startHour, startMinute);
          const endTime = new Date(1970, 0, 1, endHour, endMinute);

          slots.push({
            restaurantId: data.restaurantId,
            date: new Date(currentDate),
            startTime,
            endTime,
            capacity: data.capacity,
            price: timeSlot.price,
            eventType: data.eventType || null,
            isAvailable: true,
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    await prisma.eventSlot.createMany({
      data: slots,
    });

    revalidatePath(`/restaurant/${restaurant.slug}`);
    revalidatePath("/owner/slots");

    return { success: true, count: slots.length };
  } catch (error) {
    console.error("Error creating bulk slots:", error);
    return { error: content.slot.createErrorMultiple };
  }
}

export async function updateEventSlot(
  id: string,
  data: Partial<EventSlotFormData>,
  userId: string
) {
  // Verify authentication
  const session = await auth();
  if (!session || !session.user) {
    return { error: content.auth.authRequired };
  }

  // Verify user matches the provided userId
  if (session.user.id !== userId) {
    return { error: content.auth.noAccess };
  }

  try {
    const slot = await prisma.eventSlot.findUnique({
      where: { id },
      include: {
        restaurant: true,
      },
    });

    if (!slot || slot.restaurant.ownerId !== userId) {
      return { error: content.slot.noEditPermission };
    }

    const updated = await prisma.eventSlot.update({
      where: { id },
      data,
    });

    revalidatePath(`/restaurant/${slot.restaurant.slug}`);
    revalidatePath("/owner/slots");

    // Convert Decimal to Number for client components
    const serializedSlot = {
      ...updated,
      price: Number(updated.price),
    };

    return { success: true, slot: serializedSlot };
  } catch (error) {
    console.error("Error updating slot:", error);
    return { error: content.slot.updateError };
  }
}

export async function deleteEventSlot(id: string, userId: string) {
  // Verify authentication
  const session = await auth();
  if (!session || !session.user) {
    return { error: content.auth.authRequired };
  }

  // Verify user matches the provided userId
  if (session.user.id !== userId) {
    return { error: content.auth.noAccess };
  }

  try {
    const slot = await prisma.eventSlot.findUnique({
      where: { id },
      include: {
        restaurant: true,
      },
    });

    if (!slot || slot.restaurant.ownerId !== userId) {
      return { error: content.slot.noDeletePermission };
    }

    await prisma.eventSlot.delete({
      where: { id },
    });

    revalidatePath(`/restaurant/${slot.restaurant.slug}`);
    revalidatePath("/owner/slots");

    return { success: true };
  } catch (error) {
    console.error("Error deleting slot:", error);
    return { error: content.slot.deleteError };
  }
}
