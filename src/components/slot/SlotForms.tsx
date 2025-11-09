"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { createEventSlot, createBulkSlots } from "@/actions/slot.actions";
import { EventType } from "@/generated/prisma";
import { content } from "@/content/text.content";
import { getEventTypeOptions } from "@/lib/eventTypeMapper";

interface Props {
  restaurantId: string;
  defaultPrice: number;
  defaultCapacity: number;
  userId: string;
}

export default function SlotForms({ restaurantId, defaultPrice, defaultCapacity, userId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);

  // Single slot form
  const [singleDate, setSingleDate] = useState("");
  const [singleStartTime, setSingleStartTime] = useState("");
  const [singleEndTime, setSingleEndTime] = useState("");
  const [singleEventType, setSingleEventType] = useState<EventType>(EventType.OTHER);
  const [singlePrice, setSinglePrice] = useState(defaultPrice.toString());

  // Bulk form
  const [bulkStartDate, setBulkStartDate] = useState("");
  const [bulkEndDate, setBulkEndDate] = useState("");
  const [bulkStartTime, setBulkStartTime] = useState("");
  const [bulkEndTime, setBulkEndTime] = useState("");
  const [bulkEventType, setBulkEventType] = useState<EventType>(EventType.OTHER);
  const [bulkPrice, setBulkPrice] = useState(defaultPrice.toString());

  const eventTypes = getEventTypeOptions();

  const handleSingleSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createEventSlot({
        restaurantId,
        date: new Date(singleDate),
        startTime: singleStartTime,
        endTime: singleEndTime,
        eventType: singleEventType,
        price: parseFloat(singlePrice),
        capacity: defaultCapacity,
      }, userId);

      if (result.success) {
        alert(content.slot.createSuccess);
        // Reset form
        setSingleDate("");
        setSingleStartTime("");
        setSingleEndTime("");
        setSinglePrice(defaultPrice.toString());
      } else {
        alert(result.error || content.slot.createError);
      }
    } catch {
      alert(content.slot.createError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSlots = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createBulkSlots({
        restaurantId,
        dateFrom: new Date(bulkStartDate),
        dateTo: new Date(bulkEndDate),
        timeSlots: [{
          startTime: bulkStartTime,
          endTime: bulkEndTime,
          price: parseFloat(bulkPrice),
        }],
        eventType: bulkEventType,
        capacity: defaultCapacity,
      }, userId);

      if (result.success) {
        alert(content.slot.createSuccessMultiple(result.count));
        // Reset form
        setBulkStartDate("");
        setBulkEndDate("");
        setBulkStartTime("");
        setBulkEndTime("");
        setBulkPrice(defaultPrice.toString());
      } else {
        alert(result.error || content.slot.createErrorMultiple);
      }
    } catch {
      alert(content.slot.createErrorMultiple);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowBulkForm(false)}
          className={`px-4 py-2 rounded-lg transition ${
            !showBulkForm
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {content.slot.singleSlotTab}
        </button>
        <button
          onClick={() => setShowBulkForm(true)}
          className={`px-4 py-2 rounded-lg transition ${
            showBulkForm
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {content.slot.multipleSlotTab}
        </button>
      </div>

      {!showBulkForm ? (
        /* Single Slot Form */
        <form onSubmit={handleSingleSlot} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-bold">{content.slot.createSingle}</h3>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-sm">
              {content.slot.dateLabel}
            </label>
            <Input
              type="date"
              value={singleDate}
              onChange={(e) => setSingleDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">
                {content.slot.startTimeLabel}
              </label>
              <Input
                type="time"
                value={singleStartTime}
                onChange={(e) => setSingleStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">
                {content.slot.endTimeLabel}
              </label>
              <Input
                type="time"
                value={singleEndTime}
                onChange={(e) => setSingleEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-sm">
              {content.slot.eventTypeLabel}
            </label>
            <Select
              selectedKeys={[singleEventType]}
              onChange={(e) => setSingleEventType(e.target.value as EventType)}
              aria-label={content.slot.eventTypeLabel}
              classNames={{
                trigger: "bg-white",
                value: "text-gray-900",
                listbox: "bg-white",
                popoverContent: "bg-white",
              }}
            >
              {eventTypes.map((type) => (
                <SelectItem key={type.value} textValue={type.label} className="text-gray-900">
                  {type.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-sm">
              {content.slot.priceLabel}
            </label>
            <Input
              type="number"
              step="any"
              min="0"
              value={singlePrice}
              onChange={(e) => setSinglePrice(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            className="w-full"
          >
            {content.slot.createButton}
          </Button>
        </form>
      ) : (
        /* Bulk Slots Form */
        <form onSubmit={handleBulkSlots} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-bold">{content.slot.createMultiple}</h3>
          <p className="text-sm text-gray-600">
            {content.slot.bulkDescription}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">
                {content.slot.startDateLabel}
              </label>
              <Input
                type="date"
                value={bulkStartDate}
                onChange={(e) => setBulkStartDate(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">
                {content.slot.endDateLabel}
              </label>
              <Input
                type="date"
                value={bulkEndDate}
                onChange={(e) => setBulkEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">
                {content.slot.startTimeLabel}
              </label>
              <Input
                type="time"
                value={bulkStartTime}
                onChange={(e) => setBulkStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-sm">
                {content.slot.endTimeLabel}
              </label>
              <Input
                type="time"
                value={bulkEndTime}
                onChange={(e) => setBulkEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-sm">
              {content.slot.eventTypeLabel}
            </label>
            <Select
              selectedKeys={[bulkEventType]}
              onChange={(e) => setBulkEventType(e.target.value as EventType)}
              aria-label={content.slot.eventTypeLabel}
              classNames={{
                trigger: "bg-white",
                value: "text-gray-900",
                listbox: "bg-white",
                popoverContent: "bg-white",
              }}
            >
              {eventTypes.map((type) => (
                <SelectItem key={type.value} textValue={type.label} className="text-gray-900">
                  {type.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-sm">
              {content.slot.priceLabel}
            </label>
            <Input
              type="number"
              step="any"
              min="0"
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            className="w-full"
          >
            {content.slot.createMultiple}
          </Button>
        </form>
      )}
    </div>
  );
}
