import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import prisma from "@/utils/prisma";
import Link from "next/link";
import DeleteRestaurantButton from "@/components/restaurant/DeleteRestaurantButton";
import RestaurantManagementHeader from "@/components/restaurant/RestaurantManagementHeader";
import { content } from "@/content/text.content";

export default async function RestaurantManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      region: true,
      images: true,
      _count: {
        select: {
          eventSlots: true,
        },
      },
    },
  });

  if (!restaurant || restaurant.ownerId !== session.user.id) {
    redirect("/owner/my-restaurants");
  }

  // Serialize restaurant data for client components
  const serializedRestaurant = {
    ...restaurant,
    pricePerHour: Number(restaurant.pricePerHour),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/owner/my-restaurants"
        className="inline-block mb-4 text-gray-600 hover:text-gray-900:text-gray-100"
      >
        {content.nav.backToList}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Restaurant Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <RestaurantManagementHeader restaurant={serializedRestaurant} />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">{content.restaurant.capacity}</p>
                <p className="text-xl font-bold">{serializedRestaurant.capacity}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">{content.restaurant.price}</p>
                <p className="text-xl font-bold">
                  {serializedRestaurant.pricePerHour.toLocaleString('ru-RU')} {content.restaurant.currency}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">{content.restaurant.title}</p>
                <p className="text-xl font-bold">{serializedRestaurant._count.eventSlots}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">{content.owner.quickActions}</h3>
            <div className="space-y-2">
              <Link
                href={`/owner/restaurant/${id}/slots`}
                className="w-full flex justify-start px-4 py-2 border-2 border-uzbek-turquoise/30 rounded-lg hover:bg-uzbek-turquoise/10 hover:border-uzbek-turquoise transition-all font-medium text-uzbek-turquoise hover:shadow-md"
              >
                {content.slot.manageSlotsButton}
              </Link>
              <Link
                href={`/owner/restaurant/${id}/edit`}
                className="w-full flex justify-start px-4 py-2 border-2 border-uzbek-gold/30 rounded-lg hover:bg-uzbek-gold/10 hover:border-uzbek-gold transition-all font-medium text-uzbek-gold hover:shadow-md"
              >
                {content.restaurant.editButton}
              </Link>
            </div>

            <hr className="my-4 border-gray-200" />

            <DeleteRestaurantButton
              restaurantId={id}
              restaurantName={serializedRestaurant.name}
              userId={session.user.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
