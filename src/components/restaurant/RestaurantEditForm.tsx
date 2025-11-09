"use client";

import { useState } from "react";
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { updateRestaurant } from "@/actions/restaurant.actions";
import { useRouter } from "next/navigation";
import { RegionWithCount } from "@/types/region.types";
import { Restaurant } from "@/generated/prisma";
import { content } from "@/content/text.content";

interface Props {
  restaurant: Omit<Restaurant, 'pricePerHour'> & {
    pricePerHour: number;
    images?: Array<{ id: string; url: string; isPrimary: boolean }>;
  };
  regions: RegionWithCount[];
  userId: string;
}

export default function RestaurantEditForm({
  restaurant,
  regions,
  userId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: restaurant.name,
    description: restaurant.description || "",
    address: restaurant.address,
    city: restaurant.city,
    regionId: restaurant.regionId,
    phone: restaurant.phone || "",
    email: restaurant.email || "",
    website: restaurant.website || "",
    capacity: restaurant.capacity,
    pricePerHour: restaurant.pricePerHour,
  });

  // Initialize with existing images or empty array
  const [imageUrls, setImageUrls] = useState<string[]>(
    restaurant.images && restaurant.images.length > 0
      ? restaurant.images.map(img => img.url)
      : [""]
  );
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;

    setUploadingIndex(index);
    setError("");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.url) {
        updateImageUrl(index, data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(content.restaurant.imageUploadError);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Filter out empty image URLs
    const validImageUrls = imageUrls.filter(url => url.trim() !== "");

    const result = await updateRestaurant(restaurant.id, formData, userId, validImageUrls);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/owner/restaurant/${restaurant.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-danger-50 text-danger p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
          {content.restaurant.nameLabel}
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          isRequired
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
          {content.restaurant.descriptionLabel}
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          minRows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            {content.restaurant.regionLabel}
          </label>
          <Select
            selectedKeys={[formData.regionId]}
            onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
            isRequired
            classNames={{
              trigger: "bg-white dark:bg-gray-800",
              value: "text-gray-900 dark:text-white",
              listbox: "bg-white dark:bg-gray-800",
              popoverContent: "bg-white dark:bg-gray-800",
            }}
          >
            {regions.map((region) => (
              <SelectItem key={region.id} textValue={region.name} className="text-gray-900 dark:text-white">
                {region.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            {content.restaurant.cityLabel}
          </label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            isRequired
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
          {content.restaurant.addressLabel}
        </label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          isRequired
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            {content.restaurant.phoneLabel}
          </label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            {content.restaurant.emailLabel}
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            {content.restaurant.websiteLabel}
          </label>
          <Input
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            {content.restaurant.capacityLabel}
          </label>
          <Input
            type="number"
            value={formData.capacity.toString()}
            onChange={(e) =>
              setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
            }
            min={1}
            isRequired
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
            {content.restaurant.priceLabel}
          </label>
          <Input
            type="number"
            value={formData.pricePerHour.toString()}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricePerHour: parseInt(e.target.value) || 0,
              })
            }
            min={0}
            isRequired
          />
        </div>
      </div>

      {/* Image URLs Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">{content.restaurant.imagesLabel}</label>
          <Button
            type="button"
            size="sm"
            variant="flat"
            onPress={addImageUrl}
          >
            {content.actions.addImage}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          {content.restaurant.imageInstructions}
        </p>
        {imageUrls.map((url, index) => (
          <div key={index} className="space-y-2">
            <div className="flex gap-2 items-end">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                  {content.restaurant.imageLabel(index, index === 0)}
                </label>
                <Input
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  isDisabled={uploadingIndex === index}
                />
              </div>
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(index, file);
                    }}
                    disabled={uploadingIndex === index}
                  />
                  <Button
                    type="button"
                    variant="flat"
                    color="primary"
                    as="span"
                    isLoading={uploadingIndex === index}
                  >
                    {content.actions.uploadFile}
                  </Button>
                </label>
                {imageUrls.length > 1 && (
                  <Button
                    type="button"
                    color="danger"
                    variant="flat"
                    onPress={() => removeImageUrl(index)}
                  >
                    {content.actions.remove}
                  </Button>
                )}
              </div>
            </div>
            {url && (
              <div className="ml-2">
                <img
                  src={url}
                  alt={content.form.imagePreview(index)}
                  className="h-20 w-20 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <Button
          variant="light"
          onPress={() => router.back()}
          isDisabled={loading}
        >
          {content.actions.cancel}
        </Button>
        <Button color="primary" type="submit" isLoading={loading}>
          {content.actions.saveChanges}
        </Button>
      </div>
    </form>
  );
}
