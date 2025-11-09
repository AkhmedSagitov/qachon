import { EventType } from "@/generated/prisma";
import { content } from "@/content/text.content";

/**
 * Маппинг EventType enum на русский текст для отображения
 * Использует централизованный контент из text.content.ts
 */
export function getEventTypeLabel(eventType: EventType | null | undefined): string {
  if (!eventType) return content.slot.eventTypes.other;

  const mapping: Record<EventType, string> = {
    [EventType.WEDDING]: content.slot.eventTypes.wedding,
    [EventType.BIRTHDAY]: content.slot.eventTypes.birthday,
    [EventType.CORPORATE]: content.slot.eventTypes.corporate,
    [EventType.ANNIVERSARY]: content.slot.eventTypes.anniversary,
    [EventType.OTHER]: content.slot.eventTypes.other,
  };

  return mapping[eventType] || content.slot.eventTypes.other;
}

/**
 * Получить все типы событий для использования в селекторах
 */
export function getEventTypeOptions() {
  return [
    { value: EventType.WEDDING, label: content.slot.eventTypes.wedding },
    { value: EventType.BIRTHDAY, label: content.slot.eventTypes.birthday },
    { value: EventType.CORPORATE, label: content.slot.eventTypes.corporate },
    { value: EventType.ANNIVERSARY, label: content.slot.eventTypes.anniversary },
    { value: EventType.OTHER, label: content.slot.eventTypes.other },
  ];
}
