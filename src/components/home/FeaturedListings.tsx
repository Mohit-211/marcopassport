"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, MapPin, Star } from "lucide-react";

import { GetAllBusinessApi } from "@/api/users/business.api";
import { mapBusinessToListing } from "@/lib/business";
import type { Listing } from "@/components/explore/ListingCard";
import type { PlacesResponse } from "@/types/business";

const FEATURED_LIMIT = 6;

export function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await GetAllBusinessApi();
        console.log(res, "res")
        const payload: PlacesResponse = res?.data?.data ?? {};
        const responseData = payload.places ?? [];
        if (!Array.isArray(responseData)) {
          setListings([]);
          return;
        }
        const mapped = responseData.map(mapBusinessToListing);
        const featured = mapped.filter((l) => l.featured);
        setListings((featured.length ? featured : mapped).slice(0, FEATURED_LIMIT));
      } catch (error) {
        console.error("Failed to fetch featured listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <section className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary/60">
              Hand-picked
            </p>

            <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl md:text-5xl">
              Featured listings
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              A few places we think are worth knowing about.
            </p>
          </div>

          <Link
            href="/explore"
            className="hidden shrink-0 text-sm font-semibold text-primary transition-colors hover:text-gold sm:block"
          >
            View all →
          </Link>
        </div>

        {/* Listings */}
        {loading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Loading listings...
          </p>
        ) : listings.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No listings found.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.slug}`}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                  <img
                    src={listing.image}
                    alt={listing.name}
                    
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Subtle bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />

                  {/* Bookmark */}
                  <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/85 text-primary backdrop-blur-sm transition-colors group-hover:bg-gold">
                    <Bookmark className="h-4 w-4" />
                  </span>

                  {/* Image metadata */}
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-white">
                      {listing.category}
                    </span>

                    <span className="text-xs font-medium text-white">
                      {listing.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-5">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 font-semibold text-gold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {listing.rating}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-border" />

                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {listing.location}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-xl font-semibold text-primary sm:text-2xl">
                    {listing.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {listing.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile link */}
        <Link
          href="/explore"
          className="mt-8 block text-center text-sm font-semibold text-primary sm:hidden"
        >
          View all featured →
        </Link>
      </div>
    </section>
  );
}
