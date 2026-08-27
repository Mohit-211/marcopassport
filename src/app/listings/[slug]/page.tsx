import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import ListingGallery from "@/components/listings/ListingGallery";
import ListingInfoContent from "@/components/listings/ListingInfoContent";
import ListingActionsPanel from "@/components/listings/ListingActionsPanel";
import ReviewsSection from "@/components/listings/ReviewsSection";
import SimilarAndRelated from "@/components/listings/SimilarAndRelated";

import { GetAllBlogsApi } from "@/api/users/blog.api";
import { mapBusinessToListing } from "@/lib/business";
import type { ApiBusiness } from "@/types/business";
import type { Blog } from "@/types/blog";
import { GetRelatesPlaceByCategoryId } from "@/api/users/places.api";
import { GetBusinessDetailsBySlugApi } from "@/api/users/business.api";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getListing(slug: string) {
  try {
    const res = await GetBusinessDetailsBySlugApi(slug);
    const item: ApiBusiness | undefined = res?.data?.data;
    if (!item) return undefined;
    return item;
  } catch (error) {
    console.error("Failed to fetch business details:", error);
    return undefined;
  }
}

async function getSimilarPlaces(categoryId: number) {
  try {
    const res = await GetRelatesPlaceByCategoryId(categoryId);
    const list = res?.data?.data?.places;
    if (!Array.isArray(list)) return [];
    return list;
  } catch (error) {
    console.error("Failed to fetch similar places:", error);
    return [];
  }
}

async function getRelatedBlogPosts(limit = 3): Promise<Blog[]> {
  try {
    const res = await GetAllBlogsApi();
    const posts: Blog[] = res?.data?.data ?? [];
    if (!Array.isArray(posts)) return [];
    return posts.slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch related blog posts:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getListing(slug);

  if (!item) return {};

  const listing = mapBusinessToListing(item);

  return {
    title: `${listing.name} — The Marco Passport`,
    description: listing.description,
    openGraph: {
      title: `${listing.name} — The Marco Passport`,
      description: listing.description,
      images: [listing.image],
    },
    twitter: {
      images: [listing.image],
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getListing(slug);

  if (!item) {
    return (
      <div className="container mx-auto px-5 py-32 text-center">
        <h1 className="font-display text-4xl font-semibold">
          Listing not found
        </h1>
        <p className="text-muted-foreground mt-3">
          It may have moved or been removed.
        </p>
        <Link href="/explore" className="inline-block mt-6">
          <Button variant="gold">Back to directory</Button>
        </Link>
      </div>
    );
  }

  const listing = mapBusinessToListing(item);
console.log(listing,"listing===============bhv")
  return (
    <>
      {/* Breadcrumbs */}
      <div className="container mx-auto px-5 lg:px-8 pt-24 md:pt-28">
        <nav className="text-xs uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/explore" className="hover:text-primary">
            Directory
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground truncate">{listing.name}</span>
        </nav>
      </div>

      <ListingGallery listing={listing} />

      {/* Main content */}
      <section className="container mx-auto px-5 lg:px-8 py-14 md:py-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
          <div className="space-y-14">
            <ListingInfoContent listing={listing} />
            <ReviewsSection id={listing.id} />
          </div>
          <ListingActionsPanel
            listing={listing}
            categoryMeta={{ name: listing.category }}
          />
        </div>
      </section>
 {/* <NearbyAndRelated
        categoriesId={place?.categories?.[0]?.id}
        currentSlug={place.slug}
      /> */}
      <SimilarAndRelated categoriesId={listing?.categories?.[0]?.id} />
      {/* <SimilarAndRelated categoriesId={2} /> */}

    </>
  );
}