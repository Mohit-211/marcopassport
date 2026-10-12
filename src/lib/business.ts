import { visibleRating } from "@/lib/explore";
import type { ApiBusiness, ApiBusinessCategory } from "@/types/business";

/** A business as the listing detail page shows it. */
export type Listing = {
  categories: ApiBusinessCategory[];
  is_in_itinerary?: boolean;
  slug: string;
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  image: string;
  /** null until the business has a review */
  rating: number | null;
  price: string;
  location: string;
  description: string;
  featured: boolean;
  website_url?: string;
  about?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  fees?: string | null;
  parking?: string | null;
  best_time_to_visit?: string | null;
  insider_tips?: string | null;
  what_to_expect?: string | null;
  highlights?: string | null;
  reviewCount?: number;
  galleryImages?: string[];
};

export function mapBusinessToListing(item: ApiBusiness): Listing {
  const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
  const image = item.featured_image
    ? `${imageBase}${item.featured_image}`
    : "/assets/explore-hero.jpg";

  return {
    id: String(item.id),
    slug: item.slug,
    name: item.name,
    categories: item.categories ?? [],
    category: item.categories?.[0]?.name ?? "",
    categorySlug: item.categories?.[0]?.slug ?? "",
    image,
    rating: visibleRating(item.rating),
    price: item.price_level ?? "",
    location: item.neighborhood || item.address || "",
    description: item.short_description || item.tagline || "",
    featured: item.is_featured ?? false,
    website_url: item.website_url,
    is_in_itinerary: item.is_in_itinerary ?? false,
    about: item.about,
    address: item.address,
    phone: item.phone,
    email: item.email,
    hours: item.hours,
    fees: item.fees ?? null,
    parking: item.parking ?? null,
    best_time_to_visit: item.best_time_to_visit ?? null,
    insider_tips: item.insider_tips ?? null,
    what_to_expect: item.what_to_expect ?? null,
    highlights: item.highlights ?? null,
    reviewCount: item.review_count,
    galleryImages: item.gallery_images?.map((src) => `${imageBase}${src}`),
  };
}
