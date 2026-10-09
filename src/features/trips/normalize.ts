import type { ApiPlace } from "@/types/place";
import type { ApiBusiness } from "@/types/business";
import type { ItemSource, NormalizedItem } from "./types";

export const FALLBACK_IMAGE = "/assets/explore-hero.jpg";

export function itemKey(source: ItemSource, sourceId: string | number) {
  return `${source}:${sourceId}`;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown): string | null {
  return text(value) || null;
}

function coordinate(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function rating(value: unknown): number | null {
  const n = coordinate(value);
  return n !== null && n > 0 ? n : null;
}

function imageUrl(path: unknown): string {
  const src = text(path);
  if (!src) return FALLBACK_IMAGE;
  if (/^https?:\/\//.test(src)) return src;
  return `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${src}`;
}

export function normalizePlace(raw: ApiPlace): NormalizedItem {
  const sourceId = String(raw.id);
  return {
    id: itemKey("places", sourceId),
    source: "places",
    sourceId,
    slug: text(raw.slug),
    name: text(raw.name) || "Untitled place",
    category: text(raw.categories?.[0]?.name) || "Place",
    address: text(raw.address) || text(raw.neighborhood),
    lat: coordinate(raw.latitude),
    lng: coordinate(raw.longitude),
    image: imageUrl(raw.featured_image),
    rating: rating(raw.rating),
    phone: nullableText(raw.phone),
    website: nullableText(raw.website_url),
    openingHours: nullableText(raw.hours),
    description: text(raw.short_description) || text(raw.about),
  };
}

export function normalizeBusiness(raw: ApiBusiness): NormalizedItem {
  const sourceId = String(raw.id);
  return {
    id: itemKey("business", sourceId),
    source: "business",
    sourceId,
    slug: text(raw.slug),
    name: text(raw.name) || "Untitled business",
    category: text(raw.categories?.[0]?.name) || "Business",
    address: text(raw.address) || text(raw.neighborhood),
    lat: coordinate(raw.latitude),
    lng: coordinate(raw.longitude),
    image: imageUrl(raw.featured_image),
    rating: rating(raw.rating),
    phone: nullableText(raw.phone),
    website: nullableText(raw.website_url),
    openingHours: nullableText(raw.hours),
    description:
      text(raw.short_description) || text(raw.tagline) || text(raw.about),
  };
}

/** Accepts whatever the list endpoints return and drops anything without an id. */
export function normalizeList<T extends { id?: unknown }>(
  raw: unknown,
  normalize: (item: T) => NormalizedItem,
): NormalizedItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is T => !!item && typeof item === "object" && item.id != null)
    .map(normalize);
}

/** Detail-page link for an item, by source. */
export function itemHref(item: Pick<NormalizedItem, "source" | "slug">) {
  if (!item.slug) return null;
  return item.source === "places" ? `/places/${item.slug}` : `/listings/${item.slug}`;
}
