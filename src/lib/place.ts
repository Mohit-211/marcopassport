import { visibleRating } from "@/lib/explore";
import type { ApiPlace } from "@/types/place";

export type PlaceDetail = {
  id: string;
  slug: string;
  name: string;

  // Basic information
  short_description: string;
  neighborhood: string;
  categories: ApiPlace["categories"];

  // Content
  tag: string;
  blurb: string;
  about: string;

  // Images
  image: string;
  featured_image: string;
  gallery: string[];

  // Flags
  featured: boolean;
  isTopPick: boolean;
  isInItinerary: boolean;

  // Reviews (rating is null until the first review)
  rating: number | null;
  reviewCount: number;

  // Details
  highlights: string | null;
  whatToExpect: string | null;
  insiderTips: string | null;

  // Location / contact
  address: string | null;
  hours: string | null;
  fees: string | null;
  parking: string | null;
  bestTimeToVisit: string | null;
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
  priceLevel: string | null;
};

export function mapPlaceToDetail(item: ApiPlace): PlaceDetail {
  const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
  const fallbackImage = "/assets/explore-hero.jpg";

  const image = item.featured_image
    ? `${imageBase}${item.featured_image}`
    : fallbackImage;

  const gallery = (item.gallery_images ?? [])
    .filter(Boolean)
    .map((src) => `${imageBase}${src}`);

  return {
    id: String(item.id),
    slug: item.slug,
    name: item.name,

    short_description: item.short_description ?? "",
    neighborhood: item.neighborhood ?? "",
    categories: item.categories ?? [],

    tag: item.categories?.[0]?.name ?? "Place",
    blurb: item.short_description ?? "",
    about: item.about ?? "",

    image,
    featured_image: image,

    gallery: gallery.length > 0 ? gallery : [image],

    featured: item.is_featured ?? false,
    isTopPick: item.is_top_pick ?? false,
    isInItinerary: item.is_in_itinerary ?? false,

    rating: visibleRating(item.rating),
    reviewCount: Number(item.review_count) || 0,

    highlights: item.highlights ?? null,
    whatToExpect: item.what_to_expect ?? null,
    insiderTips: item.insider_tips ?? null,

    address: item.address ?? null,
    hours: item.hours ?? null,
    fees: item.fees ?? null,
    parking: item.parking ?? null,
    bestTimeToVisit: item.best_time_to_visit ?? null,

    phone: item.phone ?? null,
    email: item.email ?? null,
    websiteUrl: item.website_url ?? null,
    priceLevel: item.price_level ?? null,
  };
}

// Splits a freeform text field (plain sentence or newline-separated list)
// into individual bullet/paragraph entries for display.
function splitTextField(
  value: string | null | undefined
): string[] {
  if (!value) return [];

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Admin "highlights": a JSON array, or newline/comma separated text. */
export function parseHighlights(highlights?: string | null): string[] {
  if (!highlights) return [];
  try {
    const parsed = JSON.parse(highlights);
    if (Array.isArray(parsed)) {
      return parsed.map((h) => String(h).trim()).filter(Boolean);
    }
  } catch {
    // Not JSON — fall back to plain text splitting.
  }
  return highlights
    .split(/\r?\n|,/)
    .map((h) => h.trim())
    .filter(Boolean);
}
/** Admin "insider tips": a JSON array, or one tip per line. */
export function parseTips(tips?: string | null): string[] {
  if (!tips) return [];
  try {
    const parsed = JSON.parse(tips);
    if (Array.isArray(parsed)) {
      return parsed.map((t) => String(t).trim()).filter(Boolean);
    }
  } catch {
    // Not JSON — fall back to plain text splitting.
  }
  return splitTextField(tips);
}
/** Admin "what to expect": a JSON array of { title, description }; anything else is ignored. */
export function parseExpectItems(
  value?: string | null
): { title: string; description: string }[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is { title: string; description: string } =>
          !!item && typeof item === "object" && typeof item.title === "string",
      );
    }
  } catch {
    // Not JSON — ignore.
  }
  return [];
}
