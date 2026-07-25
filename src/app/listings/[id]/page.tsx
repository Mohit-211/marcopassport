import Link from "next/link";
import type { Metadata } from "next";
import { featuredListings, blogPosts, categories } from "@/data/content";
import { Button } from "@/components/ui/button";
import ListingGallery from "@/components/listings/ListingGallery";
import ListingInfoContent from "@/components/listings/ListingInfoContent";
import ListingActionsPanel from "@/components/listings/ListingActionsPanel";
import SimilarAndRelated from "@/components/listings/SimilarAndRelated";

type Listing = (typeof featuredListings)[number];

type Props = {
  params: Promise<{ id: string }>;
};

function getListing(id: string): Listing | undefined {
  return featuredListings.find((l) => l.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = getListing(id);

  if (!listing) return {};

  return {
    title: `${listing.name} — Marco Passport`,
    description: listing.description,
    openGraph: {
      title: `${listing.name} — Marco Passport`,
      description: listing.description,
      images: [listing.image],
    },
    twitter: {
      images: [listing.image],
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = getListing(id);

  if (!listing) {
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

  const similar = featuredListings
    .filter((l) => l.id !== listing.id)
    .slice(0, 3);
  const relatedBlog = blogPosts.slice(0, 3);
  const categoryMeta = categories.find((c) => c.name === listing.category);

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
          <ListingInfoContent listing={listing} />
          <ListingActionsPanel listing={listing} categoryMeta={categoryMeta} />
        </div>
      </section>

      <SimilarAndRelated similar={similar} relatedBlog={relatedBlog} />
    </>
  );
}
