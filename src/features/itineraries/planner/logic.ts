import type { ExploreItem } from "@/lib/explore";
import type { ItineraryDraft } from "../types";

/**
 * Pure helpers for the "Plan my trip" planner: category chips, filtering
 * and the read-only share link. Listings come from the backend (Explore's
 * data); nothing here calls an API.
 */

export const MARCO_ISLAND = { lat: 25.9417, lng: -81.718 };

/* ---------------------------------------------------------------- chips */

export type ChipId = "all" | "events" | "dining" | "lodging" | "todo" | "shopping" | "services";

export interface PlannerChip {
  id: ChipId;
  label: string;
  /** Matched against each listing category's name and slug (lowercase, substring) */
  keywords: string[];
}

/**
 * Categories are backend records, so chips match them by keyword rather than
 * by fixed id. Add a keyword here when a new category should show up under a
 * chip. Places to visit that match nothing fall under "To Do".
 */
export const PLANNER_CHIPS: PlannerChip[] = [
  { id: "all", label: "All", keywords: [] },
  { id: "events", label: "Events", keywords: ["event", "festival", "live music", "nightlife", "entertainment"] },
  { id: "dining", label: "Dining", keywords: ["restaurant", "dining", "food", "cafe", "coffee", "bar", "seafood", "eat"] },
  { id: "lodging", label: "Lodging", keywords: ["lodging", "hotel", "resort", "stay", "inn", "vacation rental", "condo"] },
  {
    id: "todo",
    label: "To Do",
    keywords: ["activit", "boat", "tour", "fishing", "charter", "beach", "park", "attraction", "museum", "golf", "kayak", "water", "land based"],
  },
  { id: "shopping", label: "Shopping", keywords: ["shop", "boutique", "retail", "store", "gallery", "market"] },
  { id: "services", label: "Local Services", keywords: ["service", "real estate", "realtor", "salon", "spa", "health", "medical", "marine", "repair"] },
];

function matchesChip(item: ExploreItem, chip: PlannerChip): boolean {
  if (chip.id === "all") return true;
  const hit = item.categories.some((c) => {
    const text = `${c.name} ${c.slug.replace(/-/g, " ")}`.toLowerCase();
    return chip.keywords.some((k) => text.includes(k));
  });
  if (hit) return true;
  // Uncategorised places to visit (beaches, parks…) are things to do.
  if (chip.id === "todo" && item.type === "place") {
    return !PLANNER_CHIPS.some((c) => c.id !== "all" && c.id !== "todo" && matchesChip(item, c));
  }
  return false;
}

/* --------------------------------------------------------- filter */

export interface PlannerFilters {
  chip: ChipId;
  query: string;
  type: "all" | ExploreItem["type"];
  /** Selected category keys (`${type}:${slug}`); empty means all */
  categories: string[];
  minRating: number;
  featuredOnly: boolean;
}

export const DEFAULT_FILTERS: PlannerFilters = {
  chip: "all",
  query: "",
  type: "all",
  categories: [],
  minRating: 0,
  featuredOnly: false,
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

/** Listings are on or near the island; coordinates farther out than this were mistyped. */
const MAX_PLAUSIBLE_MILES = 250;

/** Miles from the island centre, or null without believable coordinates. */
export function milesFromCentre(item: ExploreItem) {
  const pos = position(item);
  const miles = pos ? distanceMiles(MARCO_ISLAND, pos) : null;
  return miles !== null && miles <= MAX_PLAUSIBLE_MILES ? miles : null;
}

export function filterListings(items: ExploreItem[], f: PlannerFilters): ExploreItem[] {
  const chip = PLANNER_CHIPS.find((c) => c.id === f.chip) ?? PLANNER_CHIPS[0];
  const q = f.query.trim().toLowerCase();
  return items.filter(
    (item) =>
      matchesChip(item, chip) &&
      (f.type === "all" || item.type === f.type) &&
      (f.categories.length === 0 || item.categories.some((c) => f.categories.includes(`${item.type}:${c.slug}`))) &&
      (item.rating ?? 0) >= f.minRating &&
      (!f.featuredOnly || item.featured) &&
      (!q ||
        [item.name, item.description, item.address ?? "", ...item.categories.map((c) => c.name)]
          .join(" ")
          .toLowerCase()
          .includes(q)),
  );
}

/* ----------------------------------------------------------- share link */

/**
 * A shared trip is a snapshot in the URL: name, dates and listing ids with
 * their visit dates. The shared page looks the listings up again, so it shows
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

export function encodeSharedTrip(draft: ItineraryDraft): string {
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

export function sharedTripPath(draft: ItineraryDraft) {
  return `/passport/shared?t=${encodeSharedTrip(draft)}`;
}

/** Distinct categories across items (places and businesses), sorted by name. */
export function categoryOptions(items: ExploreItem[], type: PlannerFilters["type"]) {
  const byKey = new Map<string, { key: string; slug: string; name: string; type: ExploreItem["type"]; count: number }>();
  for (const item of items) {
    if (type !== "all" && item.type !== type) continue;
    for (const c of item.categories) {
      const key = `${item.type}:${c.slug}`;
      const existing = byKey.get(key);
      if (existing) existing.count++;
      else byKey.set(key, { key, slug: c.slug, name: c.name, type: item.type, count: 1 });
    }
  }
  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name));
}
