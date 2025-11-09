"use client";

import SafeImage from "@/components/UI/SafeImage";
import { RestaurantImage } from "@/generated/prisma";

interface Props {
  images: RestaurantImage[];
  restaurantName: string;
}

export default function RestaurantGallery({ images, restaurantName }: Props) {
  const primaryImage = images?.find((img) => img.isPrimary) || images?.[0];

  return (
    <div>
      <SafeImage
        src={primaryImage?.url}
        alt={restaurantName}
        width={800}
        height={400}
        className="w-full h-[400px] object-cover rounded-lg"
        priority
      />
      {/* Gallery */}
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.slice(1, 5).map((img) => (
            <SafeImage
              key={img.id}
              src={img.url}
              alt={img.alt || restaurantName}
              width={100}
              height={80}
              className="w-full h-20 object-cover rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  );
}
