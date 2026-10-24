import { placeImage } from "@/features/passport/place";
import type { PassportPlace } from "@/features/passport/types";
import type { ApiExploreItem } from "@/types/explore";

/**
 * Places to visit and businesses are the same kind of thing in the API
 * (one table, `type` tells them apart), so Explore shows them together in
 * this one shape.
 */
export type ExploreType = "place" | "business";

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
  /** The API's relative path, kept for passport snapshots */
  imagePath: string | null;
  categories: ExploreCategory[];
  /** First category's name; empty when it has none */
  category: string;
  /** Neighborhood, else address; empty when it has neither */
  location: string;
  address: string | null;
  /** null when the place has no map position */
  latitude: number | null;
  longitude: number | null;
  /** "$" – "$$$$", businesses only */
  price: string | null;
  /** null when the place has no reviews yet */
  rating: number | null;
  reviewCount: number;
  featured: boolean;
  topPick: boolean;
  href: string;
}

/**
 * A place's average rating, or null when there's nothing to show. The API
 * stores 0/null until the first review, and a 0-star rating shouldn't be
 * displayed anywhere.
 */
export function visibleRating(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** "beaches" → "beach", "boats" → "boat"; short words stay as they are. */
function singular(word: string) {
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

/**
 * Search for Explore and the planner: every word of the query
 * appears somewhere in the name, description, area, address or categories,
 * in any order. Plurals match singulars, so "beaches south" finds South Beach.
 */
export function matchesSearch(item: ExploreItem, query: string): boolean {
  const words = query.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (words.length === 0) return true;
  const text = [
    item.name,
    item.description,
    item.location,
    item.address ?? "",
    ...item.categories.map((c) => c.name),
  ]
    .join(" ")
    .toLowerCase();
  return words.every((word) => text.includes(word) || text.includes(singular(word)));
}

/** The API may send coordinates as strings; 0 or blank means "not set". */
export function toCoordinate(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n !== 0 ? n : null;
}

/** Every place has its page under /explore, whatever its type. */
export function exploreHref(slug: string) {
  return `/explore/${slug}`;
}

export function toExploreItem(raw: ApiExploreItem, type: ExploreType): ExploreItem {
  const categories: ExploreCategory[] = (raw.categories ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    type,
  }));
  return {
    id: Number(raw.id),
    type,
    slug: raw.slug,
    name: raw.name,
    description: raw.short_description || raw.tagline || "",
    image: placeImage(raw.featured_image),
    imagePath: raw.featured_image ?? null,
    categories,
    // Empty rather than a made-up value when the admin hasn't set one; the UI hides it.
    category: categories[0]?.name ?? "",
    location: raw.neighborhood || raw.address || "",
    address: raw.address ?? null,
    latitude: toCoordinate(raw.latitude),
    longitude: toCoordinate(raw.longitude),
    price: raw.price_level ?? null,
    rating: visibleRating(raw.rating),
    reviewCount: Number(raw.review_count) || 0,
    featured: Boolean(raw.is_featured),
    topPick: Boolean(raw.is_top_pick),
    href: exploreHref(raw.slug),
  };
}

/** The snapshot a passport keeps for display (see features/passport). */
export function toPassportPlace(item: ExploreItem): PassportPlace {
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
