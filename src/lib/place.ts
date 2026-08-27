import type { ApiPlace } from "@/types/place";

export type PlaceCard = {
  featured_image: string | null;
  updated_at: string | null;
  short_description: string;
  id: string;
  slug: string;
  name: string;
  tag: string;
  blurb: string;
  image: string;
  featured: boolean;
  isTopPick: boolean;
  rating: number;
};

export function mapPlaceToCard(item: ApiPlace): PlaceCard {
  const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

  return {
    id: String(item.id),
    slug: item.slug,
    name: item.name,
    tag: item.categories?.[0]?.name ?? "Place",
    blurb: item.short_description ?? "",
    image: item.featured_image
      ? `${imageBase}${item.featured_image}`
      : "/assets/explore-hero.jpg",
    featured_image: item.featured_image ?? null,
    updated_at: item.updated_at ?? null,
    short_description: item.short_description ?? "",
    featured: item.is_featured ?? false,
    isTopPick: item.is_top_pick ?? false,
    rating: Number(item.rating) || 0,
  };
}

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
  isInPassport: boolean;

  // Reviews
  rating: number;
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
    isInPassport: item.is_in_passport ?? false,

    rating: Number(item.rating) || 0,
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
export function splitTextField(
  value: string | null | undefined
): string[] {
  if (!value) return [];

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}