import type { PassportPlace } from "./types";

const FALLBACK_PLACE_IMAGE = "/assets/explore-hero.jpg";

/** Image fields are paths relative to the API host; snapshots may already hold a full URL. */
export function placeImage(path: string | null | undefined) {
  if (!path) return FALLBACK_PLACE_IMAGE;
  if (/^https?:\/\//.test(path) || path.startsWith("/assets/")) return path;
  return `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${path}`;
}

/** The place's page on Explore, or null for a snapshot without a slug. */
export function placeHref(place: Pick<PassportPlace, "slug">) {
  return place.slug ? `/explore/${place.slug}` : null;
}
