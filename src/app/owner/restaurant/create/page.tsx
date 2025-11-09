import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { getAllRegions } from "@/actions/restaurant.actions";
import RestaurantForm from "@/components/restaurant/RestaurantForm";
import { content } from "@/content/text.content";

export default async function CreateRestaurantPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const result = await getAllRegions();

  if (!result.regions) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-danger-50 text-danger p-4 rounded-md">
          {content.restaurant.loadErrorRegions}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{content.restaurant.addRestaurant}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <RestaurantForm regions={result.regions} userId={session.user.id} />
      </div>
    </div>
  );
}
