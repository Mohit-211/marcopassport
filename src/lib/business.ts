import type { Listing } from "@/components/explore/ListingCard";
import type { ApiBusiness } from "@/types/business";

export function mapBusinessToListing(item: ApiBusiness): Listing {
  const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
  const image = item.featured_image
    ? `${imageBase}${item.featured_image}`
    : "/assets/explore-hero.jpg";

  return {
    id: String(item.id),
    slug: item.slug,
    name: item.name,
    category: item.categories?.[0]?.name ?? "",
    categorySlug: item.categories?.[0]?.slug ?? "",
    image,
    rating: item.rating ?? 0,
    price: item.price_level ?? "",
    location: item.neighborhood || item.address || "",
    description: item.short_description || item.tagline || "",
    featured: item.is_featured ?? false,
    website_url: item.website_url,
    is_in_passport:item.is_in_passport,
    about: item.about,
    address: item.address,
    phone: item.phone,
    email: item.email,
    hours: item.hours,
    highlights: item.highlights,
    reviewCount: item.review_count,
    galleryImages: item.gallery_images?.map((src) => `${imageBase}${src}`),
  };
}
