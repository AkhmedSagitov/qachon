"use client";

import Link from "next/link";
import SafeImage from "@/components/UI/SafeImage";
import { content } from "@/content/text.content";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  city: string;
  isActive: boolean;
  images: Array<{ isPrimary: boolean; url: string }>;
  region: { name: string };
  _count: {
    eventSlots: number;
  };
}

interface Props {
  restaurant: Restaurant;
}

export default function OwnerRestaurantCard({ restaurant }: Props) {
  const primaryImage =
    restaurant.images?.find((img) => img.isPrimary) || restaurant.images?.[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <SafeImage
        src={primaryImage?.url}
        alt={restaurant.name}
        width={400}
        height={200}
        className="w-full h-[200px] object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{restaurant.name}</h3>
          <span
            className={`text-xs px-2 py-1 rounded ${
              restaurant.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {restaurant.isActive ? content.restaurant.active : content.restaurant.inactive}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          {restaurant.city}, {restaurant.region.name}
        </p>
        <div className="flex gap-2 mb-4">
          <span className="text-xs px-2 py-1 rounded bg-gray-100">
            {content.restaurant.slotsCount(restaurant._count.eventSlots)}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/restaurant/${restaurant.slug}`}
            className="flex-1 text-center px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100:bg-gray-700 transition"
          >
            {content.actions.viewDetails}
          </Link>
          <Link
            href={`/owner/restaurant/${restaurant.id}`}
            className="flex-1 text-center px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {content.actions.manage}
          </Link>
        </div>
      </div>
    </div>
  );
}
