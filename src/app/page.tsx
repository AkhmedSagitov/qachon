import { getRestaurants, getRegions } from "@/actions/restaurant.actions";
import RestaurantList from "@/components/restaurant/RestaurantList";
import SearchForm from "@/components/restaurant/SearchForm";
import Link from "next/link";
import Image from "next/image";
import { content } from "@/content/text.content";
import { siteConfig } from "@/config/site.config";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; name?: string; page?: string }>;
}) {
  const { region, name, page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const result = await getRestaurants(region, name, currentPage);
  const { regions } = await getRegions();

  if (!result || 'error' in result) {
    return <div>Error loading restaurants</div>;
  }

  const { restaurants, pagination } = result;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12 bg-white rounded-2xl p-6 sm:p-10 border-2 border-uzbek-burgundy/30 shadow-lg">
        <div className="inline-block mb-4">
          <Image
            src="/logo-new.png"
            alt={siteConfig.title}
            width={150}
            height={150}
            priority
            className="mx-auto"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-uzbek-burgundy">
          {content.home.title}
        </h1>
        <p className="hidden sm:block text-base md:text-lg text-gray-700 mb-4 sm:mb-6 px-2 max-w-2xl mx-auto leading-relaxed">
          {content.home.description}
        </p>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {regions && <SearchForm regions={regions} />}
        </div>
      </div>

      {/* Restaurant List */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">
            {name
              ? content.restaurant.searchResults(name)
              : region
              ? content.restaurant.searchResultsRegion
              : content.restaurant.allRestaurants}
          </h2>
          <p className="text-sm sm:text-base text-default-600">
            {content.restaurant.resultsCount(pagination?.totalCount || 0)}
          </p>
        </div>
        {restaurants && <RestaurantList restaurants={restaurants} pagination={pagination} />}
      </div>

      {/* CTA for Owners */}
      <div className="mt-8 sm:mt-16 relative overflow-hidden bg-white rounded-2xl p-8 sm:p-10 text-center shadow-xl border-4 border-uzbek-champagne">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-uzbek-burgundy/5 via-uzbek-champagne/5 to-uzbek-slate/5"></div>

        <div className="relative z-10">
          <div className="inline-block mb-4 text-6xl">
            👨‍🍳
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-uzbek-burgundy">
            {content.home.ctaTitle}
          </h3>
          <p className="mb-6 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            {content.home.ctaDescription}
          </p>
          <Link
            href="/owner/restaurant/create"
            className="inline-block bg-uzbek-champagne hover:bg-uzbek-burgundy text-black hover:text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            {content.home.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
