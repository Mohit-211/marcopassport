import {
  addMinutes,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  parse,
  parseISO,
} from "date-fns";

import { DEFAULT_DESTINATION } from "@/data/trip-planner";
import type {
  ItineraryEntry,
  PlannerItem,
  PriceLevel,
  Travelers,
  Trip,
  TripDraft,
} from "@/types/trip";

/** Key in Trip.days for stops that haven't been given a day yet. */
export const UNSCHEDULED = "unscheduled";

export const toDayKey = (date: Date) => format(date, "yyyy-MM-dd");
export const fromDayKey = (key: string) => parseISO(key);

export function createId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${random}`;
}

export function nightsBetween(start: string, end: string) {
  return differenceInCalendarDays(fromDayKey(end), fromDayKey(start));
}

export function tripDayKeys(trip: Pick<Trip, "startDate" | "endDate">) {
  return eachDayOfInterval({
    start: fromDayKey(trip.startDate),
    end: fromDayKey(trip.endDate),
  }).map(toDayKey);
}

/** "Oct 8–12", "Oct 30–Nov 2", or "Dec 30, 2026–Jan 2, 2027" */
export function formatDateRange(start: string, end: string) {
  const s = fromDayKey(start);
  const e = fromDayKey(end);
  if (s.getFullYear() !== e.getFullYear()) {
    return `${format(s, "MMM d, yyyy")}–${format(e, "MMM d, yyyy")}`;
  }
  if (s.getMonth() !== e.getMonth()) {
    return `${format(s, "MMM d")}–${format(e, "MMM d")}`;
  }
  return `${format(s, "MMM d")}–${format(e, "d")}`;
}

export function suggestTripName(draft: Pick<TripDraft, "destinations" | "startDate" | "endDate">) {
  const place =
    draft.destinations.find((d) => d.trim())?.split(",")[0].trim() ||
    DEFAULT_DESTINATION.split(",")[0];
  const base = `${place} Getaway`;
  if (!draft.startDate || !draft.endDate) return base;
  return `${base}, ${formatDateRange(draft.startDate, draft.endDate)}`;
}

export function tripNameFor(draft: TripDraft) {
  return draft.nameEdited ? draft.name : suggestTripName(draft);
}

export function formatTravelers({ adults, children, pets }: Travelers) {
  const plural = (n: number, one: string, many: string) =>
    `${n} ${n === 1 ? one : many}`;
  return [
    plural(adults, "adult", "adults"),
    children > 0 && plural(children, "child", "children"),
    pets > 0 && plural(pets, "pet", "pets"),
  ]
    .filter(Boolean)
    .join(" · ");
}

export function priceLabel(level: PriceLevel) {
  return level === 0 ? "Free" : "$".repeat(level);
}

/** "14:30" -> "2:30 PM" */
export function formatTime(time: string) {
  return format(parse(time, "HH:mm", new Date()), "h:mm a");
}

export function sortByTime(entries: ItineraryEntry[]) {
  return [...entries].sort((a, b) => a.time.localeCompare(b.time));
}

/** Prefer the item's usual start time; otherwise slot it two hours after the last stop. */
export function nextTimeSlot(entries: ItineraryEntry[], item: PlannerItem) {
  const taken = new Set(entries.map((e) => e.time));
  if (item.time && !taken.has(item.time)) return item.time;
  const last = sortByTime(entries).at(-1);
  if (!last) return item.time ?? "09:00";
  const next = format(addMinutes(parse(last.time, "HH:mm", new Date()), 120), "HH:mm");
  // Don't wrap past midnight
  return next > last.time ? next : "23:30";
}

/**
 * Move an entry to a new position. Time slots stay where they are, so the
 * moved stop takes on the time of the slot it was dropped into and the list
 * stays in time order.
 */
export function reorderKeepingTimes(
  entries: ItineraryEntry[],
  from: number,
  to: number,
) {
  if (from === to) return entries;
  const times = entries.map((e) => e.time);
  const next = [...entries];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next.map((entry, i) => ({ ...entry, time: times[i] }));
}

/**
 * Rebuild the day map for new dates. Plans on days that still exist stay put;
 * stops on days that no longer exist move to Unscheduled instead of being lost.
 */
export function rebuildDays(
  days: Trip["days"],
  startDate: string,
  endDate: string,
) {
  const keys = tripDayKeys({ startDate, endDate });
  const orphans: ItineraryEntry[] = [];
  for (const [key, entries] of Object.entries(days)) {
    if (key !== UNSCHEDULED && !keys.includes(key)) orphans.push(...entries);
  }
  return {
    days: {
      ...Object.fromEntries(keys.map((key) => [key, days[key] ?? []])),
      [UNSCHEDULED]: [...(days[UNSCHEDULED] ?? []), ...orphans],
    },
    moved: orphans.length,
  };
}

export function emptyDraft(): TripDraft {
  return {
    destinations: [DEFAULT_DESTINATION],
    startDate: null,
    endDate: null,
    travelers: { adults: 2, children: 0, pets: 0 },
    groupType: null,
    interests: [],
    budget: null,
    name: "",
    nameEdited: false,
  };
}

export function draftFromTrip(trip: Trip): TripDraft {
  return {
    destinations: trip.destinations,
    startDate: trip.startDate,
    endDate: trip.endDate,
    travelers: trip.travelers,
    groupType: trip.groupType,
    interests: trip.interests,
    budget: trip.budget,
    name: trip.name,
    nameEdited: true,
  };
}

/* ---------------------------- share links ---------------------------- */

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Trips live in the visitor's browser for now, so the share link carries the
 * itinerary itself in the URL hash (never sent to the server). Once trips are
 * stored in a backend this can become a short /plan/share/:id link.
 */
export function encodeTripForShare(trip: Trip) {
  return toBase64Url(JSON.stringify(trip));
}

export function decodeSharedTrip(value: string): Trip | null {
  try {
    const trip = JSON.parse(fromBase64Url(value)) as Trip;
    if (!trip?.name || !trip.startDate || !trip.endDate || !trip.days) return null;
    return trip;
  } catch {
    return null;
  }
}
