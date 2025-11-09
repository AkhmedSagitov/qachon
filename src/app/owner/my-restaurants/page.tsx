import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { getMyRestaurants } from "@/actions/restaurant.actions";
import Link from "next/link";
import OwnerRestaurantCard from "@/components/restaurant/OwnerRestaurantCard";
import { content } from "@/content/text.content";

export default async function MyRestaurantsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const { restaurants } = await getMyRestaurants(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{content.restaurant.myRestaurants}</h1>
        <Link
          href="/owner/restaurant/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          {content.owner.addRestaurant}
        </Link>
      </div>

      {!restaurants || restaurants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-lg text-gray-500 mb-4">
            {content.restaurant.noRestaurantsOwner}
          </p>
          <Link
            href="/owner/restaurant/create"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {content.restaurant.addFirstRestaurant}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <OwnerRestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
