import { getRestaurantBySlug } from "@/actions/restaurant.actions";
import { getAvailableSlots } from "@/actions/slot.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import SlotCalendar from "@/components/slot/SlotCalendar";
import RestaurantGallery from "@/components/restaurant/RestaurantGallery";
import { content } from "@/content/text.content";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { restaurant, error } = await getRestaurantBySlug(slug);

  if (error || !restaurant) {
    notFound();
  }

  const { slots } = await getAvailableSlots(restaurant.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-block mb-4 text-gray-600 hover:text-gray-900:text-gray-100"
      >
        {content.nav.backToList}
      </Link>

      {/* Restaurant Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <RestaurantGallery images={restaurant.images} restaurantName={restaurant.name} />

        <div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg text-gray-600">
              {restaurant.city}, {restaurant.region.name}
            </p>
          </div>

          <p className="text-gray-700 mb-6">{restaurant.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{content.restaurant.capacity}</p>
              <p className="text-xl font-bold">{content.restaurant.capacityDisplay(restaurant.capacity)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{content.restaurant.price}</p>
              <p className="text-xl font-bold text-green-600">
                {content.restaurant.priceFrom(Number(restaurant.pricePerHour).toLocaleString('ru-RU'))}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {restaurant.address && (
              <p className="text-sm">
                <span className="font-semibold">{content.contact.address}</span> {restaurant.address}
              </p>
            )}
            {restaurant.phone && (
              <p className="text-sm">
                <span className="font-semibold">{content.contact.phone}</span>{" "}
                <a href={`tel:${restaurant.phone}`} className="text-blue-600 hover:underline">
                  {restaurant.phone}
                </a>
              </p>
            )}
            {restaurant.email && (
              <p className="text-sm">
                <span className="font-semibold">{content.contact.email}</span>{" "}
                <a href={`mailto:${restaurant.email}`} className="text-blue-600 hover:underline">
                  {restaurant.email}
                </a>
              </p>
            )}
            {restaurant.website && (
              <p className="text-sm">
                <span className="font-semibold">{content.contact.website}</span>{" "}
                <a
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {restaurant.website}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Available Slots */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{content.slot.availableSlots}</h2>
        <p className="text-gray-600 mb-4">
          {content.slot.slotsDescription}
        </p>
        {slots && <SlotCalendar slots={slots} />}
      </div>
    </div>
  );
}
