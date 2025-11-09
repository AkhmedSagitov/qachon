"use client";

import { SerializedRestaurantBasic } from "@/types/restaurant.types";
import Link from "next/link";
import SafeImage from "@/components/UI/SafeImage";
import { content } from "@/content/text.content";

interface Props {
  restaurant: SerializedRestaurantBasic;
}

export default function RestaurantCard({ restaurant }: Props) {
  const primaryImage = restaurant.images?.find((img) => img.isPrimary) || restaurant.images?.[0];

  return (
    <Link
      href={`/restaurant/${restaurant.slug}`}
      className="w-full bg-white rounded-lg shadow-md hover:scale-105 hover:shadow-xl hover:shadow-uzbek-burgundy/20 transition-all overflow-hidden block border border-transparent hover:border-uzbek-burgundy/30"
    >
      <div className="relative">
        <SafeImage
          src={primaryImage?.url}
          alt={restaurant.name}
          width={400}
          height={200}
          className="w-full object-cover h-[140px] sm:h-[180px] md:h-[200px]"
        />
        <div className="absolute top-2 right-2 bg-uzbek-champagne/90 backdrop-blur-sm text-black px-2 py-1 sm:px-3 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
          {content.restaurant.priceFrom(Number(restaurant.pricePerHour).toLocaleString('ru-RU'))}
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 text-gray-900 line-clamp-1">{restaurant.name}</h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-2 flex items-center gap-1">
          <span className="text-uzbek-slate">📍</span>
          <span className="truncate">{restaurant.city}, {restaurant.region.name}</span>
        </p>
        <p className="text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 text-gray-600">{restaurant.description}</p>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs rounded-full bg-uzbek-burgundy/10 text-uzbek-burgundy font-medium border border-uzbek-burgundy/20">
            {content.restaurant.capacityDisplay(restaurant.capacity)}
          </span>
        </div>
      </div>
    </Link>
  );
}
