"use server";

import prisma from "@/utils/prisma";
import { restaurantSchema } from "@/lib/validations/restaurant.schema";
import { RestaurantFormData, SerializedRestaurantBasic } from "@/types/restaurant.types";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth/auth";
import { Prisma } from "@/generated/prisma";
import { content } from "@/content/text.content";

type GetRestaurantsResult =
  | {
      success: true;
      restaurants: SerializedRestaurantBasic[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        itemsPerPage: number;
      }
    }
  | { error: string };

export async function getRestaurants(regionSlug?: string, searchName?: string, page: number = 1): Promise<GetRestaurantsResult> {
  try {
    const ITEMS_PER_PAGE = 6;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const where: Prisma.RestaurantWhereInput = {
      isActive: true,
      ...(regionSlug && {
        region: {
          slug: regionSlug,
        },
      }),
      ...(searchName && {
        name: {
          contains: searchName,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
    };

    // Get total count for pagination
    const totalCount = await prisma.restaurant.count({ where });

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        region: true,
        images: {
          where: {
            isPrimary: true,
          },
        },
        _count: {
          select: {
            eventSlots: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: ITEMS_PER_PAGE,
    });

    // Convert Decimal to Number for client components
    const serializedRestaurants = restaurants.map(restaurant => ({
      ...restaurant,
      pricePerHour: Number(restaurant.pricePerHour),
    }));

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return {
      success: true,
      restaurants: serializedRestaurants,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        itemsPerPage: ITEMS_PER_PAGE,
      }
    };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return { error: content.restaurant.loadError };
  }
}

export async function getRestaurantBySlug(slug: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        region: true,
        images: true,
      },
    });

    if (!restaurant) {
      return { error: content.restaurant.notFound };
    }

    // Convert Decimal to Number for client components
    const serializedRestaurant = {
      ...restaurant,
      pricePerHour: Number(restaurant.pricePerHour),
    };

    return { success: true, restaurant: serializedRestaurant };
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return { error: content.restaurant.loadErrorSingle };
  }
}

export async function getMyRestaurants(userId: string) {
  // Verify authentication
  const session = await auth();
  if (!session || !session.user) {
    return { error: content.auth.authRequired };
  }

  // Verify user can only access their own restaurants
  if (session.user.id !== userId) {
    return { error: content.auth.noAccess };
  }

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        region: true,
        images: {
          where: {
            isPrimary: true,
          },
        },
        _count: {
          select: {
            eventSlots: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to Number for client components
    const serializedRestaurants = restaurants.map(restaurant => ({
      ...restaurant,
      pricePerHour: Number(restaurant.pricePerHour),
    }));

    return { success: true, restaurants: serializedRestaurants };
  } catch (error) {
    console.error("Error fetching my restaurants:", error);
    return { error: content.restaurant.loadErrorOwner };
  }
}

// Transliterate cyrillic to latin
function transliterate(text: string): string {
  const map: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  return text
    .toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('');
}

export async function createRestaurant(
  data: RestaurantFormData,
  userId: string,
  imageUrls?: string[]
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

  const validation = restaurantSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || content.validation.validationError,
    };
  }

  try {
    // Generate slug from name with transliteration
    const transliterated = transliterate(data.name);
    const slug = transliterated
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50); // Limit length

    const restaurant = await prisma.restaurant.create({
      data: {
        ...validation.data,
        slug: `${slug}-${Date.now()}`,
        ownerId: userId,
      },
    });

    // Create restaurant images if URLs provided
    if (imageUrls && imageUrls.length > 0) {
      await prisma.restaurantImage.createMany({
        data: imageUrls.map((url, index) => ({
          restaurantId: restaurant.id,
          url: url,
          alt: content.restaurant.imageAlt(restaurant.name, index),
          isPrimary: index === 0, // First image is primary
        })),
      });
    }

    revalidatePath("/");
    revalidatePath("/owner/my-restaurants");

    // Convert Decimal to Number for client components
    const serializedRestaurant = {
      ...restaurant,
      pricePerHour: Number(restaurant.pricePerHour),
    };

    return { success: true, restaurant: serializedRestaurant };
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return { error: content.restaurant.createError };
  }
}

export async function updateRestaurant(
  id: string,
  data: RestaurantFormData,
  userId: string,
  imageUrls?: string[]
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

  const validation = restaurantSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || content.validation.validationError,
    };
  }

  try {
    // Check ownership
    const existing = await prisma.restaurant.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!existing || existing.ownerId !== userId) {
      return { error: content.restaurant.noEditPermission };
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: validation.data,
    });

    // Update images if provided
    if (imageUrls !== undefined) {
      // Delete old images
      await prisma.restaurantImage.deleteMany({
        where: { restaurantId: id },
      });

      // Create new images
      if (imageUrls.length > 0) {
        await prisma.restaurantImage.createMany({
          data: imageUrls.map((url, index) => ({
            restaurantId: id,
            url: url,
            alt: content.restaurant.imageAlt(restaurant.name, index),
            isPrimary: index === 0,
          })),
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/owner/my-restaurants");
    revalidatePath(`/restaurant/${restaurant.slug}`);

    // Convert Decimal to Number for client components
    const serializedRestaurant = {
      ...restaurant,
      pricePerHour: Number(restaurant.pricePerHour),
    };

    return { success: true, restaurant: serializedRestaurant };
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return { error: content.restaurant.updateError };
  }
}

export async function deleteRestaurant(id: string, userId: string) {
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
    const existing = await prisma.restaurant.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!existing || existing.ownerId !== userId) {
      return { error: content.restaurant.noDeletePermission };
    }

    await prisma.restaurant.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/owner/my-restaurants");

    return { success: true };
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return { error: content.restaurant.deleteError };
  }
}

export async function getRegions() {
  try {
    const regions = await prisma.region.findMany({
      include: {
        _count: {
          select: {
            restaurants: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, regions };
  } catch (error) {
    console.error("Error fetching regions:", error);
    return { error: content.restaurant.loadErrorRegions };
  }
}
