"use client";

import Link from "next/link";
import {
  Star,
  Globe,
  ArrowRight,
  Sparkles,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToItineraryButton } from "@/features/itineraries/components/AddToItineraryButton";
import type { ItineraryPlace } from "@/features/itineraries/types";

type ListingActionsPanelProps = {
  listing: {
    slug: string;
    id: string;
    name: string;
    image: string;
    description?: string;
    address?: string;
    price: string;
    category: string;
    location: string;
    rating: number | null;
    website_url?: string;
  };
  categoryMeta?: { name: string };
};

export default function ListingActionsPanel({
  listing,
  categoryMeta,

}: ListingActionsPanelProps) {
  const itineraryPlace: ItineraryPlace = {
    id: Number(listing.id),
    type: "business",
    name: listing.name,
    slug: listing.slug,
    short_description: listing.description ?? null,
    featured_image: listing.image,
    address: listing.address ?? null,
  };

  return (
    <>
      {/* Sticky action panel */}
      <aside>
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                {categoryMeta?.name ?? listing.category}
              </span>
              <span className="text-sm font-semibold text-gold">
                {listing.price}
              </span>
            </div>
            <p className="font-display text-2xl font-semibold mt-3 leading-tight">
              Plan your visit
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Add it to an itinerary, then pick a date and see the route in
              My Passport.
            </p>

            <AddToItineraryButton place={itineraryPlace} size="lg" className="mt-5 w-full" />

            {listing.website_url ? (
              <a
                href={listing.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" size="lg" className="w-full mt-3">
                  <Globe className="h-4 w-4" /> Visit website
                </Button>
              </a>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="w-full mt-3"
                disabled
              >
                <Globe className="h-4 w-4" /> Visit website
              </Button>
            )}
            <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-3 text-xs">
              {listing.rating !== null && (
                <div>
                  <p className="uppercase tracking-wider text-muted-foreground font-semibold">
                    Rating
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 font-display text-lg font-semibold text-foreground">
                    <Star className="h-4 w-4 fill-gold text-gold" /> {listing.rating.toFixed(1)}
                  </p>
                </div>
              )}
              <div>
                <p className="uppercase tracking-wider text-muted-foreground font-semibold">
                  Area
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-foreground truncate">
                  {listing.location}
                </p>
              </div>
            </div>

            <button className="mt-5 w-full inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-primary transition">
              <Share2 className="h-3.5 w-3.5" /> Share this listing
            </button>
          </div>

          <div className="rounded-3xl bg-primary text-primary-foreground p-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Concierge
            </div>
            <p className="font-display text-xl font-semibold mt-2 leading-tight">
              Need help planning?
            </p>
            <p className="text-sm text-primary-foreground/80 mt-2">
              Our island concierge can tailor your itinerary and lock in
              hard-to-get reservations.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 mt-4 text-gold font-semibold text-sm story-link"
            >
              Message concierge <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile sticky action bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border px-4 py-3 flex gap-2 shadow-elegant">
        <AddToItineraryButton place={itineraryPlace} className="flex-1" compactLabel />
        {listing.website_url ? (
          <a href={listing.website_url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full">
              <Globe className="h-4 w-4" /> Visit
            </Button>
          </a>
        ) : (
          <Button variant="outline" className="flex-1" disabled>
            <Globe className="h-4 w-4" /> Visit
          </Button>
        )}
      </div>
    </>
  );
}
