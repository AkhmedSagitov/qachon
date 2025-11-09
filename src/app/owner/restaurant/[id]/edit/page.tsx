import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { getAllRegions } from "@/actions/restaurant.actions";
import prisma from "@/utils/prisma";
import RestaurantEditForm from "@/components/restaurant/RestaurantEditForm";
import Link from "next/link";
import { content } from "@/content/text.content";

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      region: true,
      images: true,
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

  const { regions } = await getAllRegions();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href={`/owner/restaurant/${id}`}
        className="inline-block mb-4 text-gray-600 hover:text-gray-900"
      >
        {content.nav.back}
      </Link>
      <h1 className="text-3xl font-bold mb-8">{content.restaurant.edit}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {regions && (
          <RestaurantEditForm
            restaurant={serializedRestaurant}
            regions={regions}
            userId={session.user.id}
          />
        )}
      </div>
    </div>
  );
}
