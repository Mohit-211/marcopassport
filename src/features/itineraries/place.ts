import type { ItineraryPlace } from "./types";

const FALLBACK_PLACE_IMAGE = "/assets/explore-hero.jpg";

/** Image fields are paths relative to the API host; snapshots may already hold a full URL. */
export function placeImage(path: string | null | undefined) {
  if (!path) return FALLBACK_PLACE_IMAGE;
  if (/^https?:\/\//.test(path) || path.startsWith("/assets/")) return path;
  return `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${path}`;
}

/** Businesses live under /listings, places-to-visit under /places. */
export function placeHref(place: Pick<ItineraryPlace, "type" | "slug">) {
  if (!place.slug) return null;
  return place.type === "business" ? `/listings/${place.slug}` : `/places/${place.slug}`;
}
