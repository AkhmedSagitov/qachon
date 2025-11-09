import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { getRestaurantSlots } from "@/actions/slot.actions";
import prisma from "@/utils/prisma";
import Link from "next/link";
import SlotForms from "@/components/slot/SlotForms";
import SlotList from "@/components/slot/SlotList";
import { content } from "@/content/text.content";

export default async function RestaurantSlotsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Check ownership
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      ownerId: true,
      pricePerHour: true,
      capacity: true,
    },
  });

  if (!restaurant || restaurant.ownerId !== session.user.id) {
    redirect("/owner/my-restaurants");
  }

  const { slots } = await getRestaurantSlots(id, session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/owner/restaurant/${id}`}
        className="inline-block mb-4 text-gray-600 hover:text-gray-900:text-gray-100"
      >
        {content.nav.back}
      </Link>

      <h1 className="text-3xl font-bold mb-2">{content.slot.manageSlots}</h1>
      <p className="text-gray-600 mb-8">{restaurant.name}</p>

      {/* Forms for creating slots */}
      <SlotForms
        restaurantId={id}
        defaultPrice={Number(restaurant.pricePerHour)}
        defaultCapacity={restaurant.capacity}
        userId={session.user.id}
      />

      {/* Existing slots */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">{content.slot.createdSlots}</h2>
        <SlotList slots={slots || []} userId={session.user.id} />
      </div>
    </div>
  );
}
