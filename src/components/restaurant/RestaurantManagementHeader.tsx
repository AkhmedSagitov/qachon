"use client";

import Link from "next/link";
import SafeImage from "@/components/UI/SafeImage";
import { content } from "@/content/text.content";

interface Props {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    city: string;
    address: string;
    images: Array<{ isPrimary: boolean; url: string }>;
    region: { name: string };
  };
}

export default function RestaurantManagementHeader({ restaurant }: Props) {
  const primaryImage =
    restaurant.images.find((img) => img.isPrimary) || restaurant.images[0];

  return (
    <div className="flex gap-4 mb-6">
      <SafeImage
        src={primaryImage?.url}
        alt={restaurant.name}
        width={200}
        height={150}
        className="rounded-lg object-cover"
      />
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {restaurant.city}, {restaurant.region.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {restaurant.address}
        </p>
        <div className="flex gap-2">
          <Link
            href={`/restaurant/${restaurant.slug}`}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {content.actions.viewDetails}
          </Link>
          <Link
            href={`/owner/restaurant/${restaurant.id}/edit`}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {content.actions.edit}
          </Link>
        </div>
      </div>
    </div>
  );
}
