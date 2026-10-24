import { placeImage } from "@/features/passport/place";
import { toCoordinate, visibleRating, type ExploreType } from "@/lib/explore";
import { toExternalUrl } from "@/lib/url";
import type { ApiExploreCategory, ApiExploreItem, JsonListField } from "@/types/explore";

/** One place on its /explore/[slug] page: places to visit and businesses alike. */
export type ExploreDetail = {
  id: number;
  type: ExploreType;
  slug: string;
  name: string;
  /** Short description, else the tagline; empty when neither is set */
  summary: string;
  /** Rich text from the admin editor, without pasted inline styles */
  about: string;
  categories: ApiExploreCategory[];
  /** First category's name; empty when it has none */
  category: string;
  neighborhood: string;

  /** Full URL of the cover photo */
  image: string;
  /** The API's relative path, kept for passport snapshots */
  imagePath: string | null;
  /** Gallery photos as full URLs; empty when there are none */
  gallery: string[];

  featured: boolean;
  /** null until the first review */
  rating: number | null;
  reviewCount: number;

  highlights: string[];
  whatToExpect: { title: string; description: string }[];
  insiderTips: string[];

  address: string | null;
  latitude: number | null;
  longitude: number | null;
  hours: string | null;
  fees: string | null;
  priceLevel: string | null;
  parking: string | null;
  bestTimeToVisit: string | null;
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
};

export function toExploreDetail(item: ApiExploreItem, type: ExploreType): ExploreDetail {
  const categories = item.categories ?? [];
  return {
    id: Number(item.id),
    type,
    slug: item.slug,
    name: item.name,
    summary: item.short_description || item.tagline || "",
    about: item.about ? cleanCmsHtml(item.about) : "",
    categories,
    category: categories[0]?.name ?? "",
    neighborhood: item.neighborhood ?? "",

    image: placeImage(item.featured_image),
    imagePath: item.featured_image ?? null,
    gallery: (item.gallery_images ?? []).filter(Boolean).map((src) => placeImage(src)),

    featured: Boolean(item.is_featured),
    rating: visibleRating(item.rating),
    reviewCount: Number(item.review_count) || 0,

    highlights: parseHighlights(item.highlights),
    whatToExpect: parseExpectItems(item.what_to_expect),
    insiderTips: parseTips(item.insider_tips),

    address: item.address || null,
    latitude: toCoordinate(item.latitude),
    longitude: toCoordinate(item.longitude),
    hours: item.hours || null,
    fees: item.fees || null,
    priceLevel: item.price_level || null,
    parking: item.parking || null,
    bestTimeToVisit: item.best_time_to_visit || null,
    phone: item.phone || null,
    email: item.email || null,
    websiteUrl: toExternalUrl(item.website_url),
  };
}

/**
 * Text pasted into the admin editor brings its own fonts, sizes and colours
 * as inline styles and <font> tags, which override the site's type. Both are
 * dropped so .blog-content styles every page the same way. Admin content is
 * trusted; this tidies it, it doesn't sanitize it.
 */
export function cleanCmsHtml(html: string): string {
  return html
    .replace(/<[a-z][^>]*>/gi, (tag) => tag.replace(/\s+style\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, ""))
    .replace(/<\/?font\b[^>]*>/gi, "");
}

// Splits a freeform text field (plain sentence or newline-separated list)
// into individual bullet/paragraph entries for display.
function splitTextField(value: string | null | undefined): string[] {
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
