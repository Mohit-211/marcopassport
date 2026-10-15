import { placeImage } from "@/features/itineraries/place";
import type { ItineraryPlace } from "@/features/itineraries/types";
import type { ApiBusiness } from "@/types/business";
import type { ApiPlace } from "@/types/place";

/**
 * Places to visit and businesses are the same kind of listing in the API
 * (one table, `type` tells them apart), so Explore shows them together in
 * this one shape.
 */
export type ExploreType = "place" | "business";

export const EXPLORE_TYPE_LABELS: Record<ExploreType, string> = {
  place: "Places to visit",
  business: "Businesses",
};

export interface ExploreCategory {
  id: number;
  name: string;
  slug: string;
  type: ExploreType;
}

export interface ExploreItem {
  id: number;
  type: ExploreType;
  slug: string;
  name: string;
  description: string;
  /** Full image URL for display */
  image: string;
  /** The API's relative path, kept for itinerary snapshots */
  imagePath: string | null;
  categories: ExploreCategory[];
  /** First category's name, or a generic label */
  category: string;
  /** Neighborhood, else address */
  location: string;
  address: string | null;
  /** null when the listing has no map position */
  latitude: number | null;
  longitude: number | null;
  /** "$" – "$$$$", businesses only */
  price: string | null;
  /** null when the listing has no reviews yet */
  rating: number | null;
  reviewCount: number;
  featured: boolean;
  topPick: boolean;
  href: string;
}

export const PRICE_LEVELS = ["$", "$$", "$$$", "$$$$"];

/**
 * A listing's average rating, or null when there's nothing to show. The API
 * stores 0/null until the first review, and a 0-star rating shouldn't be
 * displayed anywhere.
 */
export function visibleRating(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** The API may send coordinates as strings; 0 or blank means "not set". */
function coordinate(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n !== 0 ? n : null;
}

function listingHref(type: ExploreType, slug: string) {
  return type === "business" ? `/listings/${slug}` : `/places/${slug}`;
}

export function toExploreItem(raw: ApiPlace | ApiBusiness, type: ExploreType): ExploreItem {
  const categories: ExploreCategory[] = (raw.categories ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    type,
  }));
  const tagline = "tagline" in raw ? raw.tagline : undefined;
  return {
    id: Number(raw.id),
    type,
    slug: raw.slug,
    name: raw.name,
    description: raw.short_description || tagline || "",
    image: placeImage(raw.featured_image),
    imagePath: raw.featured_image ?? null,
    categories,
    category: categories[0]?.name ?? (type === "place" ? "Place" : "Business"),
    location: raw.neighborhood || raw.address || "Marco Island",
    address: raw.address ?? null,
    latitude: coordinate(raw.latitude),
    longitude: coordinate(raw.longitude),
    price: raw.price_level ?? null,
    rating: visibleRating(raw.rating),
    reviewCount: Number(raw.review_count) || 0,
    featured: Boolean(raw.is_featured),
    topPick: Boolean(raw.is_top_pick),
    href: listingHref(type, raw.slug),
  };
}

/** The snapshot an itinerary keeps for display (see features/itineraries). */
export function toItineraryPlace(item: ExploreItem): ItineraryPlace {
  return {
    id: item.id,
    type: item.type,
    name: item.name,
    slug: item.slug,
    short_description: item.description,
    featured_image: item.imagePath,
    address: item.address,
    latitude: item.latitude?.toString() ?? null,
    longitude: item.longitude?.toString() ?? null,
  };
}

/** Alternates the two lists (place, business, place, …) so neither crowds out the other. */
export function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}
