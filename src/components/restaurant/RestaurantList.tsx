"use client";

import { SerializedRestaurantBasic } from "@/types/restaurant.types";
import RestaurantCard from "./RestaurantCard";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import { content } from "@/content/text.content";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
}

interface Props {
  restaurants: SerializedRestaurantBasic[];
  pagination?: PaginationData;
}

export default function RestaurantList({ restaurants, pagination }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-default-500">
          {content.restaurant.noResults}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-6">
          <Button
            onPress={() => handlePageChange(pagination.currentPage - 1)}
            isDisabled={pagination.currentPage === 1}
            variant="bordered"
            size="lg"
            className="font-semibold min-w-[140px]"
          >
            ← {content.pagination.previous}
          </Button>

          <div className="flex items-center gap-2 justify-center">
            {(() => {
              const current = pagination.currentPage;
              const total = pagination.totalPages;
              const pages: (number | string)[] = [];

              if (total <= 7) {
                // Show all pages if 7 or fewer
                for (let i = 1; i <= total; i++) {
                  pages.push(i);
                }
              } else {
                // Always show first page
                pages.push(1);

                if (current > 3) {
                  pages.push('...');
                }

                // Show pages around current
                const start = Math.max(2, current - 1);
                const end = Math.min(total - 1, current + 1);

                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }

                if (current < total - 2) {
                  pages.push('...');
                }

                // Always show last page
                pages.push(total);
              }

              return pages.map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                const isActive = pagination.currentPage === page;
                return (
                  <Button
                    key={page}
                    onPress={() => handlePageChange(page as number)}
                    color={isActive ? "primary" : "default"}
                    variant={isActive ? "solid" : "bordered"}
                    size="lg"
                    className={`min-w-[48px] font-bold ${
                      isActive
                        ? "shadow-lg scale-110"
                        : "hover:scale-105"
                    } transition-transform`}
                  >
                    {page}
                  </Button>
                );
              });
            })()}
          </div>

          <Button
            onPress={() => handlePageChange(pagination.currentPage + 1)}
            isDisabled={pagination.currentPage === pagination.totalPages}
            variant="bordered"
            size="lg"
            className="font-semibold min-w-[140px]"
          >
            {content.pagination.next} →
          </Button>
        </div>
      )}
    </div>
  );
}
