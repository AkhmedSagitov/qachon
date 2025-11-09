import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { getMyRestaurants } from "@/actions/restaurant.actions";
import Link from "next/link";
import { content } from "@/content/text.content";

export default async function OwnerDashboard() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const { restaurants = [] } = await getMyRestaurants(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-uzbek-burgundy to-uzbek-champagne bg-clip-text text-transparent">
          {content.owner.dashboard}
        </h1>
        <Link
          href="/owner/restaurant/create"
          className="bg-gradient-to-r from-uzbek-burgundy to-uzbek-champagne hover:shadow-lg text-white px-6 py-3 rounded-lg transition-all font-bold hover:scale-105"
        >
          {content.owner.addRestaurant}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">{content.owner.totalRestaurants}</p>
          <p className="text-3xl font-bold">{restaurants.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">{content.owner.activeSlots}</p>
          <p className="text-3xl font-bold">
            {restaurants.reduce((sum, r) => sum + r._count.eventSlots, 0)}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/owner/my-restaurants"
          className="bg-gradient-to-br from-uzbek-burgundy/10 to-uzbek-burgundy/5 border-2 border-uzbek-burgundy/30 hover:border-uzbek-burgundy rounded-lg shadow-md p-6 text-center hover:shadow-xl hover:scale-105 transition-all"
        >
          <p className="text-2xl mb-2">🏪</p>
          <p className="text-lg font-bold text-uzbek-burgundy">{content.owner.myRestaurants}</p>
        </Link>
        <Link
          href="/owner/restaurant/create"
          className="bg-gradient-to-br from-uzbek-champagne/10 to-uzbek-champagne/5 border-2 border-uzbek-champagne/30 hover:border-uzbek-champagne rounded-lg shadow-md p-6 text-center hover:shadow-xl hover:scale-105 transition-all"
        >
          <p className="text-2xl mb-2">➕</p>
          <p className="text-lg font-bold text-uzbek-champagne">{content.restaurant.addRestaurant}</p>
        </Link>
        <Link
          href="/owner/my-restaurants"
          className="bg-gradient-to-br from-uzbek-slate/10 to-uzbek-slate/5 border-2 border-uzbek-slate/30 hover:border-uzbek-slate rounded-lg shadow-md p-6 text-center hover:shadow-xl hover:scale-105 transition-all"
        >
          <p className="text-2xl mb-2">📅</p>
          <p className="text-lg font-bold text-uzbek-slate">{content.owner.manageSlots}</p>
        </Link>
      </div>
    </div>
  );
}
