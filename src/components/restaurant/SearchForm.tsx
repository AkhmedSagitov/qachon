"use client";

import { Button, Select, SelectItem, Input } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RegionWithCount } from "@/types/region.types";
import { content } from "@/content/text.content";

interface Props {
  regions: RegionWithCount[];
}

export default function SearchForm({ regions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRegion, setSelectedRegion] = useState(
    searchParams.get("region") || "all"
  );
  const [searchName, setSearchName] = useState(
    searchParams.get("name") || ""
  );

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedRegion && selectedRegion !== "all") {
      params.set("region", selectedRegion);
    }

    if (searchName.trim()) {
      params.set("name", searchName.trim());
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const allRegions = [
    { slug: "all", name: content.restaurant.allRegions, _count: { restaurants: 0 } },
    ...regions,
  ];

  return (
    <div className="w-full space-y-4">
      {/* Name Search */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-700 dark:text-gray-300 font-bold text-sm">
          {content.restaurant.name}
        </label>
        <Input
          placeholder={content.restaurant.searchPlaceholder}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full"
          classNames={{
            input: "text-gray-900 dark:text-white text-base",
            inputWrapper: "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 h-12 min-h-[48px]",
          }}
        />
      </div>

      {/* Region Select */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-700 dark:text-gray-300 font-bold text-sm">
          {content.restaurant.region}
        </label>
        <Select
          selectedKeys={[selectedRegion]}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full"
          aria-label={content.form.selectRegion}
          classNames={{
            trigger: "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 h-12 min-h-[48px]",
            value: "text-gray-900 dark:text-white text-base",
            innerWrapper: "py-0",
            listbox: "bg-white dark:bg-gray-800",
            popoverContent: "bg-white dark:bg-gray-800",
          }}
        >
        {allRegions.map((region) => (
          <SelectItem
            key={region.slug}
            textValue={region.slug === "all" ? region.name : `${region.name} ${region._count.restaurants}`}
            className="text-gray-900 dark:text-white"
          >
            {region.slug === "all" ? region.name : `${region.name} (${region._count.restaurants})`}
          </SelectItem>
        ))}
      </Select>
      </div>

      {/* Search Button */}
      <Button
        onPress={handleSearch}
        color="primary"
        fullWidth
        className="h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
      >
        {content.restaurant.searchButton}
      </Button>
    </div>
  );
}
