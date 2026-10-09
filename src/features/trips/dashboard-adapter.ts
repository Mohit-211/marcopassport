import { addDays, differenceInCalendarDays, parseISO } from "date-fns";

import type { DashboardItem } from "@/components/trip-planner/dashboard/controller";
import { EXAMPLE_PLACES } from "@/data/example-places";
import { UNSCHEDULED, toDayKey } from "@/lib/trip-planner/trip-utils";
import type { ItineraryEntry, Trip } from "@/types/trip";
import { tripDayCount, tripLocation } from "./trip-logic";
import type { NormalizedItem, TripWithItems } from "./types";

/**
 * Shows a My Trips trip in the planner's TripDashboard. Each entry's id and
 * itemId are the TripItem id, so dashboard actions map straight back to it.
 * My Trips has no times, notes or travelers, so those stay empty.
 */
export function toDashboardTrip(trip: TripWithItems): Trip {
  const dayCount = tripDayCount(trip);
  const days: Record<string, ItineraryEntry[]> = {};
  const sorted = [...trip.items].sort((a, b) => a.sortOrder - b.sortOrder);
  for (const item of sorted) {
    const n = item.dayNumber;
    const key = n && n >= 1 && n <= dayCount ? toDayKey(addDays(parseISO(trip.startDate), n - 1)) : UNSCHEDULED;
    (days[key] ??= []).push({ id: item.id, itemId: item.id, time: "", notes: "" });
  }

  return {
    id: trip.id,
    name: trip.name,
    destinations: [tripLocation(trip)],
    startDate: trip.startDate,
    endDate: trip.endDate,
    travelers: { adults: 0, children: 0, pets: 0 },
    groupType: "solo",
    interests: [],
    budget: null,
    days,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };
}

/**
 * The Places/Business API has no coordinates yet, so stops borrow them from the
 * /example dummy data to show markers and routes. Set to false once the API
 * returns real latitude/longitude.
 */
const USE_EXAMPLE_COORDINATES = true;

const EXAMPLE_COORDS = EXAMPLE_PLACES.flatMap((p) =>
  p.latitude != null && p.longitude != null
    ? [{ name: String(p.name).toLowerCase(), slug: String(p.slug ?? ""), lat: Number(p.latitude), lng: Number(p.longitude) }]
    : [],
);

/** Same name/slug when possible, otherwise a stable pick so each stop keeps its spot */
function exampleCoords(item: NormalizedItem) {
  const name = item.name.toLowerCase();
  const match =
    EXAMPLE_COORDS.find((p) => p.name === name || (item.slug && p.slug === item.slug)) ??
    EXAMPLE_COORDS.find((p) => p.name.includes(name) || name.includes(p.name));
  if (match) return match;
  const hash = [...item.id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  return EXAMPLE_COORDS[hash % EXAMPLE_COORDS.length];
}

export function toDashboardItems(trip: TripWithItems): Map<string, DashboardItem> {
  return new Map(
    trip.items.map(({ id, normalizedSnapshot: s }) => {
      const fallback = USE_EXAMPLE_COORDINATES && (s.lat === null || s.lng === null) ? exampleCoords(s) : null;
      return [
        id,
        {
          name: s.name,
          image: s.image,
          subtitle: [s.category, s.address].filter(Boolean).join(" · "),
          lat: fallback ? fallback.lat : s.lat,
          lng: fallback ? fallback.lng : s.lng,
        },
      ];
    }),
  );
}

/** Dashboard day key → My Trips day number (null for Unscheduled) */
export function dayNumberFromKey(trip: Pick<TripWithItems, "startDate">, key: string): number | null {
  if (key === UNSCHEDULED) return null;
  return differenceInCalendarDays(parseISO(key), parseISO(trip.startDate)) + 1;
}
