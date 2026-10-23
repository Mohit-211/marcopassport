"use client";

import {
  Star,
  Globe,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToItineraryButton } from "@/features/itineraries/components/AddToItineraryButton";
import type { ItineraryPlace } from "@/features/itineraries/types";
import { shareLink } from "@/lib/share";

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
  const category = categoryMeta?.name || listing.category;

  // Always the listing's own page, whatever the current URL carries.
  const share = () =>
    shareLink({
      title: listing.name,
      text: listing.description || undefined,
      url: `${window.location.origin}/listings/${listing.slug}`,
    });

  return (
    <>
      {/* Sticky action panel */}
      <aside>
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
            {(category || listing.price) && (
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                  {category}
                </span>
                {listing.price && (
                  <span className="text-sm font-semibold text-gold">
                    {listing.price}
                  </span>
                )}
              </div>
            )}
            <p className="font-display text-2xl font-semibold mt-3 leading-tight">
              Plan your visit
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Add it to an itinerary, then pick a date and see the route in
              My Passport.
            </p>

            <AddToItineraryButton place={itineraryPlace} size="lg" className="mt-5 w-full" />

            {listing.website_url && (
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
            )}
            {(listing.rating !== null || listing.location) && (
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
                {listing.location && (
                  <div>
                    <p className="uppercase tracking-wider text-muted-foreground font-semibold">
                      Area
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold text-foreground truncate">
                      {listing.location}
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={share}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-primary transition"
            >
              <Share2 className="h-3.5 w-3.5" /> Share this listing
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sticky action bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border px-4 py-3 flex gap-2 shadow-elegant">
        <AddToItineraryButton place={itineraryPlace} className="flex-1" compactLabel />
        {listing.website_url && (
          <a href={listing.website_url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full">
              <Globe className="h-4 w-4" /> Visit
            </Button>
          </a>
        )}
      </div>
    </>
  );
}
