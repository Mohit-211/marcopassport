import type { ApiPlace } from "@/types/place";

/** The shape the /example page uses for a place. */
export interface Place {
  id: string;
  sourceId: string;
  name: string;
  category: string;
  address: string;
  lat: number | null;
  lng: number | null;
  image: string | null;
  rating: number | null;
  phone: string | null;
  website: string | null;
  description: string;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function imageUrl(path: unknown): string | null {
  const src = text(path);
  if (!src) return null;
  // Absolute URLs and the site's own /assets files are used as-is
  if (/^https?:\/\//.test(src) || src.startsWith("/assets/")) return src;
  return `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${src}`;
}

/** Only this file knows the raw Places API shape. */
export function normalizePlace(raw: ApiPlace): Place {
  const sourceId = String(raw.id);
  const lat = numberOrNull(raw.latitude);
  const lng = numberOrNull(raw.longitude);
  const rating = numberOrNull(raw.rating);
  return {
    id: `place-${sourceId}`,
    sourceId,
    name: text(raw.name) || "Untitled place",
    category: text(raw.categories?.[0]?.name) || "Place",
    address: text(raw.address) || text(raw.neighborhood),
    lat: lat !== null && Math.abs(lat) <= 90 ? lat : null,
    lng: lng !== null && Math.abs(lng) <= 180 ? lng : null,
    image: imageUrl(raw.featured_image),
    rating: rating !== null && rating > 0 ? rating : null,
    phone: text(raw.phone) || null,
    website: text(raw.website_url) || null,
    description: text(raw.short_description) || text(raw.about),
  };
}

/** Places that can be shown on the map. */
export function hasCoordinates(place: Place): place is Place & { lat: number; lng: number } {
  return place.lat !== null && place.lng !== null;
}
