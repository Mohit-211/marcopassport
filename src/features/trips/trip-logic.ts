import { differenceInCalendarDays, parseISO } from "date-fns";
import { DEFAULT_DESTINATION } from "@/data/trip-planner";
import type { NormalizedItem, TripInput, TripItem, TripWithItems } from "./types";

/**
 * Pure trip operations shared by every storage backend. They never mutate their
 * input, so they are safe to use directly on React state.
 */

export class DuplicateTripItemError extends Error {
  constructor(public readonly existing: TripItem) {
    super("Item is already in this trip");
    this.name = "DuplicateTripItemError";
  }
}

export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function findTripItem(
  trip: Pick<TripWithItems, "items">,
  item: Pick<NormalizedItem, "source" | "sourceId">,
) {
  return trip.items.find(
    (i) => i.source === item.source && i.sourceId === item.sourceId,
  );
}

export function validateTripInput(input: TripInput): string | null {
  if (!input.name.trim()) return "Give your trip a name";
  if (!input.location?.trim()) return "Choose where you're going";
  if (!input.startDate || !input.endDate) return "Pick a start and end date";
  if (input.endDate < input.startDate) return "End date can't be before the start date";
  return null;
}

export function newTrip(input: TripInput, userId: string | null, now = new Date()): TripWithItems {
  const stamp = now.toISOString();
  return {
    id: createId(),
    userId,
    name: input.name.trim(),
    location: input.location.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    createdAt: stamp,
    updatedAt: stamp,
    items: [],
  };
}

/** Throws DuplicateTripItemError if the item is already saved in this trip. */
export function withItemAdded(
  trip: TripWithItems,
  item: NormalizedItem,
  now = new Date(),
): TripWithItems {
  const existing = findTripItem(trip, item);
  if (existing) throw new DuplicateTripItemError(existing);

  const stamp = now.toISOString();
  const sortOrder = trip.items.reduce((max, i) => Math.max(max, i.sortOrder), -1) + 1;
  const tripItem: TripItem = {
    id: createId(),
    tripId: trip.id,
    source: item.source,
    sourceId: item.sourceId,
    normalizedSnapshot: item,
    dayNumber: null,
    sortOrder,
    createdAt: stamp,
  };
  return { ...trip, items: [...trip.items, tripItem], updatedAt: stamp };
}

export function withItemRemoved(trip: TripWithItems, tripItemId: string, now = new Date()) {
  return {
    ...trip,
    items: trip.items.filter((i) => i.id !== tripItemId),
    updatedAt: now.toISOString(),
  };
}

export function withItemDay(
  trip: TripWithItems,
  tripItemId: string,
  dayNumber: number | null,
  now = new Date(),
): TripWithItems {
  return {
    ...trip,
    items: trip.items.map((i) => (i.id === tripItemId ? { ...i, dayNumber } : i)),
    updatedAt: now.toISOString(),
  };
}

/** Trips saved before locations existed have none; show the default instead. */
export function tripLocation(trip: { location?: string }) {
  return trip.location?.trim() || DEFAULT_DESTINATION;
}

export function tripDayCount(trip: Pick<TripWithItems, "startDate" | "endDate">) {
  if (!trip.startDate || !trip.endDate) return 0;
  const days = differenceInCalendarDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1;
  return Math.max(days, 0);
}

/**
 * Items grouped by day. Index 0 is Unscheduled; items whose day falls outside
 * the trip (e.g. after the dates were shortened) also land there.
 */
export function groupItemsByDay(trip: TripWithItems): TripItem[][] {
  const count = tripDayCount(trip);
  const groups: TripItem[][] = Array.from({ length: count + 1 }, () => []);
  const sorted = [...trip.items].sort((a, b) => a.sortOrder - b.sortOrder);
  for (const item of sorted) {
    const day = item.dayNumber;
    groups[day && day >= 1 && day <= count ? day : 0].push(item);
  }
  return groups;
}
