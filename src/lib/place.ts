import { visibleRating } from "@/lib/explore";
import { toExternalUrl } from "@/lib/url";
import type { ApiPlace, JsonListField } from "@/types/place";

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
  highlights: JsonListField;
  whatToExpect: JsonListField;
  insiderTips: JsonListField;

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
    websiteUrl: toExternalUrl(item.website_url),
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

/**
 * The list in a JSON list field: the array the API sends for a JSON column,
 * or one encoded in a string (older rows). null for plain text.
 */
function jsonList(value: JsonListField | undefined): unknown[] | null {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null; // Not JSON: plain text.
  }
}

function nonEmptyStrings(list: unknown[]): string[] {
  return list
    .filter((item) => typeof item === "string" || typeof item === "number")
    .map((item) => String(item).trim())
    .filter(Boolean);
}

/** Admin "highlights": an array, or newline/comma separated text. */
export function parseHighlights(highlights?: JsonListField): string[] {
  const list = jsonList(highlights);
  if (list) return nonEmptyStrings(list);
  if (typeof highlights !== "string") return [];
  return highlights
    .split(/\r?\n|,/)
    .map((h) => h.trim())
    .filter(Boolean);
}
/** Admin "insider tips": an array, or one tip per line. */
export function parseTips(tips?: JsonListField): string[] {
  const list = jsonList(tips);
  if (list) return nonEmptyStrings(list);
  return typeof tips === "string" ? splitTextField(tips) : [];
}
/** Admin "what to expect": an array of { title, description }; anything else is ignored. */
export function parseExpectItems(
  value?: JsonListField
): { title: string; description: string }[] {
  return (jsonList(value) ?? []).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const { title, description } = item as { title?: unknown; description?: unknown };
    if (typeof title !== "string" || !title.trim()) return [];
    return [{ title: title.trim(), description: typeof description === "string" ? description.trim() : "" }];
  });
}
