import { matchesSearch, type ExploreItem } from "@/lib/explore";
import type { PassportDraft } from "../types";

/**
 * Pure helpers for the "Plan my trip" planner: filtering and the read-only
 * share link. Places come from the backend (Explore's data); nothing here
 * calls an API.
 */

export const MARCO_ISLAND = { lat: 25.9417, lng: -81.718 };

/* --------------------------------------------------------- filter */

export interface PlannerFilters {
  query: string;
  /** Selected category slugs; empty means all */
  categories: string[];
}

export const DEFAULT_FILTERS: PlannerFilters = {
  query: "",
  categories: [],
};

/** Straight-line distance in miles (haversine). */
export function distanceMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

export function position(item: Pick<ExploreItem, "latitude" | "longitude">) {
  return item.latitude != null && item.longitude != null ? { lat: item.latitude, lng: item.longitude } : null;
}

/** Places are on or near the island; coordinates farther out than this were mistyped. */
const MAX_PLAUSIBLE_MILES = 250;

/** Miles from the island centre, or null without believable coordinates. */
export function milesFromCentre(item: ExploreItem) {
  const pos = position(item);
  const miles = pos ? distanceMiles(MARCO_ISLAND, pos) : null;
  return miles !== null && miles <= MAX_PLAUSIBLE_MILES ? miles : null;
}

export function filterPlaces(items: ExploreItem[], f: PlannerFilters): ExploreItem[] {
  return items.filter(
    (item) =>
      (f.categories.length === 0 || item.categories.some((c) => f.categories.includes(c.slug))) &&
      matchesSearch(item, f.query),
  );
}

/* ----------------------------------------------------------- share link */

/**
 * A shared trip is a snapshot in the URL: name, dates and place ids with
 * their visit dates. The shared page looks the places up again, so it shows
 * current names and photos, and it's read-only by construction.
 */
export interface SharedTrip {
  name: string;
  start_date: string | null;
  end_date: string | null;
  stops: Array<{ id: number; date: string | null }>;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const bin = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function encodeSharedTrip(draft: PassportDraft): string {
  return toBase64Url(
    JSON.stringify({
      n: draft.name,
      s: draft.start_date,
      e: draft.end_date,
      i: draft.items.map((item) => (item.visit_date ? [item.place_id, item.visit_date] : [item.place_id])),
    }),
  );
}

/** Null for anything malformed; never throws. */
export function decodeSharedTrip(value: string | undefined | null): SharedTrip | null {
  if (!value) return null;
  try {
    const raw = JSON.parse(fromBase64Url(value));
    if (!raw || !Array.isArray(raw.i)) return null;
    const date = (d: unknown) => (typeof d === "string" && DATE.test(d) ? d : null);
    const seen = new Set<number>();
    const stops: SharedTrip["stops"] = [];
    for (const entry of raw.i.slice(0, 50)) {
      const id = Number(Array.isArray(entry) ? entry[0] : NaN);
      const validId = Number.isInteger(id) && id > 0;
      if (!validId || seen.has(id)) continue;
      seen.add(id);
      stops.push({ id, date: date(entry[1]) });
    }
    return {
      name: typeof raw.n === "string" && raw.n.trim() ? raw.n.slice(0, 150) : "Marco Island trip",
      start_date: date(raw.s),
      end_date: date(raw.e),
      stops,
    };
  } catch {
    return null;
  }
}

export function sharedTripPath(draft: PassportDraft) {
  return `/passport/shared?t=${encodeSharedTrip(draft)}`;
}

/** Distinct categories across items with how many places are in each, sorted by name. */
export function categoryOptions(items: ExploreItem[]) {
  const bySlug = new Map<string, { slug: string; name: string; count: number }>();
  for (const item of items) {
    for (const slug of new Set(item.categories.map((c) => c.slug))) {
      const existing = bySlug.get(slug);
      if (existing) existing.count++;
      else bySlug.set(slug, { slug, name: item.categories.find((c) => c.slug === slug)!.name, count: 1 });
    }
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}
