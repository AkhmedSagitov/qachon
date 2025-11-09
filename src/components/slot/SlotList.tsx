"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@heroui/react";
import { deleteEventSlot } from "@/actions/slot.actions";
import { useRouter } from "next/navigation";
import { content } from "@/content/text.content";
import { getEventTypeLabel } from "@/lib/eventTypeMapper";
import { EventType } from "@/generated/prisma";

interface Slot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  price: number;
  isAvailable: boolean;
  eventType: EventType | null;
}

interface Props {
  slots: Slot[];
  userId: string;
}

export default function SlotList({ slots, userId }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Group slots by date
  const slotsByDate = slots.reduce((acc: any, slot) => {
    const dateKey = format(new Date(slot.date), "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {});

  const handleDelete = async (slotId: string) => {
    if (!confirm(content.slot.deleteConfirm)) {
      return;
    }

    setDeletingId(slotId);
    const result = await deleteEventSlot(slotId, userId);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }

    setDeletingId(null);
  };

  if (slots.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {content.slot.noSlots}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(slotsByDate).map(([dateKey, dateSlots]: [string, any]) => (
        <div key={dateKey} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">
            {format(new Date(dateKey), "d MMMM yyyy, EEEE", { locale: ru })}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dateSlots.map((slot: Slot) => (
              <div
                key={slot.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">
                      ⏰ {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {content.slot.capacityDisplay(slot.capacity)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      slot.isAvailable
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {slot.isAvailable ? content.slot.available : content.slot.unavailable}
                  </span>
                </div>
                <p className="text-lg font-bold text-green-600 mb-2">
                  {Number(slot.price).toLocaleString('ru-RU')} {content.slot.currency}
                </p>
                {slot.eventType && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {getEventTypeLabel(slot.eventType)}
                  </p>
                )}
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => handleDelete(slot.id)}
                  isLoading={deletingId === slot.id}
                  className="w-full"
                >
                  {content.actions.delete}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
