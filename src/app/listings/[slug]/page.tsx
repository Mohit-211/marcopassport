import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingGallery from "@/components/listings/ListingGallery";
import ListingInfoContent from "@/components/listings/ListingInfoContent";
import ListingActionsPanel from "@/components/listings/ListingActionsPanel";
import ReviewsSection from "@/components/listings/ReviewsSection";
import { SimilarListings } from "@/components/explore/SimilarListings";

import { mapBusinessToListing } from "@/lib/business";
import type { ApiBusiness } from "@/types/business";
import { GetBusinessDetailsBySlugApi } from "@/api/users/business.api";
import { isNotFoundError } from "@/errors/apiError";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * The business, or undefined when the API says there's no such listing (the
 * page then answers 404). Any other failure throws, so it reaches the error
 * page instead of claiming the listing doesn't exist.
 */
async function getListing(slug: string) {
  try {
    const res = await GetBusinessDetailsBySlugApi(slug);
    const item: ApiBusiness | undefined = res?.data?.data;
    return item ?? undefined;
  } catch (error) {
    if (isNotFoundError(error)) return undefined;
    throw error;
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
  if (!item) notFound();

  const listing = mapBusinessToListing(item);
  return (
    <>
      {/* Breadcrumbs */}
      <div className="site-container pt-24 md:pt-28">
        <nav className="text-xs uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/explore?type=business" className="hover:text-primary">
            Explore
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground truncate">{listing.name}</span>
        </nav>
      </div>

      <ListingGallery listing={listing} />

      {/* Main content */}
      <section className="site-container py-14 md:py-20">
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
      <SimilarListings
        type="business"
        categoryId={listing.categories?.[0]?.id}
        currentSlug={listing.slug}
      />

    </>
  );
}