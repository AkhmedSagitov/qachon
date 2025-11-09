"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { ru } from "date-fns/locale";
import { getEventTypeLabel } from "@/lib/eventTypeMapper";
import { EventType } from "@/generated/prisma";
import { content } from "@/content/text.content";

interface Slot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  price: number;
  eventType: EventType | null;
  isAvailable: boolean;
}

interface Props {
  slots: Slot[];
}

export default function SlotCalendar({ slots }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get slots for a specific date
  const getSlotsForDate = (date: Date) => {
    return slots.filter((slot) =>
      isSameDay(new Date(slot.date), date) && slot.isAvailable
    );
  };

  // Get slots for selected date
  const selectedSlots = selectedDate ? getSlotsForDate(selectedDate) : [];

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={prevMonth}
            className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300:bg-gray-600 transition text-sm sm:text-base"
          >
            ←
          </button>
          <h3 className="text-base sm:text-lg md:text-xl font-bold">
            {format(currentMonth, "LLLL yyyy", { locale: ru })}
          </h3>
          <button
            onClick={nextMonth}
            className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300:bg-gray-600 transition text-sm sm:text-base"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2">
          {content.calendar.dayNames.map((day) => (
            <div key={day} className="text-center font-semibold text-[10px] sm:text-xs md:text-sm text-gray-600 p-1 sm:p-2">
              {day}
            </div>
          ))}

          {daysInMonth.map((day) => {
            const daySlots = getSlotsForDate(day);
            const hasSlots = daySlots.length > 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = day < new Date() && !isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => hasSlots && !isPast && setSelectedDate(day)}
                disabled={!hasSlots || isPast}
                className={`
                  p-1 sm:p-2 md:p-3 rounded text-center transition-all min-h-[40px] sm:min-h-[50px] md:min-h-[60px] flex flex-col items-center justify-center
                  ${isPast ? "opacity-30 cursor-not-allowed" : ""}
                  ${isToday(day) ? "border-2 border-blue-500" : ""}
                  ${isSelected ? "bg-blue-600 text-white" : ""}
                  ${hasSlots && !isSelected && !isPast ? "bg-green-100 hover:bg-green-200:bg-green-800 cursor-pointer" : ""}
                  ${!hasSlots && !isPast ? "bg-gray-100 cursor-not-allowed" : ""}
                `}
              >
                <div className="text-xs sm:text-sm md:text-base font-semibold">{format(day, "d")}</div>
                {hasSlots && !isPast && (
                  <div className="text-[8px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1 leading-tight">{content.calendar.slotCount(daySlots.length)}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot details */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">
          {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: ru }) : content.calendar.selectDate}
        </h3>

        {!selectedDate ? (
          <p className="text-sm sm:text-base text-gray-500 text-center py-8 sm:py-12">
            {content.calendar.selectDatePrompt}
          </p>
        ) : selectedSlots.length === 0 ? (
          <p className="text-sm sm:text-base text-gray-500 text-center py-8 sm:py-12">
            {content.calendar.noSlotsForDate}
          </p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {selectedSlots.map((slot) => (
              <div key={slot.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base md:text-lg">
                      {content.calendar.timeIcon} {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {content.slot.capacityDisplay(slot.capacity)}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-green-100 text-green-800 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ml-2">
                    {content.slot.available}
                  </span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 mb-2">
                  {Number(slot.price).toLocaleString('ru-RU')} {content.slot.currency}
                </p>
                {slot.eventType && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    {getEventTypeLabel(slot.eventType)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
