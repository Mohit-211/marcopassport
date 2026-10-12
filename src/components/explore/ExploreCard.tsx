"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { AddToItineraryButton } from "@/features/itineraries/components/AddToItineraryButton";
import { toItineraryPlace, type ExploreItem } from "@/lib/explore";
import { cn } from "@/lib/utils";

/** Navy for places to visit, gold for businesses — the same everywhere they appear. */
const TYPE_HINTS: Record<ExploreItem["type"], string> = {
  place: "Beaches, parks, landmarks and nature spots to visit.",
  business: "Restaurants, stays, shops, tours and local services.",
};

function TypeBadge({ type, className }: { type: ExploreItem["type"]; className?: string }) {
  return (
    <Tooltip content={TYPE_HINTS[type]}>
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-sm",
          type === "place" ? "bg-primary text-primary-foreground" : "bg-gold text-gold-foreground",
          className,
        )}
      >
        {type === "place" ? "Place to visit" : "Business"}
      </span>
    </Tooltip>
  );
}

export function RatingBadge({ rating, reviewCount, className }: { rating: number | null; reviewCount?: number; className?: string }) {
  if (rating === null) return null;
  return (
    <Tooltip
      content={`Average visitor rating${reviewCount ? ` from ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}` : ""}`}
    >
      <span className={cn("inline-flex items-center gap-1 text-sm font-semibold text-primary", className)}>
        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
        {rating.toFixed(1)}
        {reviewCount ? <span className="font-normal text-muted-foreground">({reviewCount})</span> : null}
      </span>
    </Tooltip>
  );
}

/** Card for any listing on Explore and the home page: details link plus a quick "Add to itinerary". */
export function ExploreCard({ item }: { item: ExploreItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant">
      <Link href={item.href} className="relative block aspect-[16/10] overflow-hidden bg-muted" tabIndex={-1} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-primary/45 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <TypeBadge type={item.type} />
          {item.featured && (
            <Tooltip content="Hand-picked by the Marco Passport team.">
              <span className="rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
                ★ Featured
              </span>
            </Tooltip>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-gold">{item.category}</p>
          <RatingBadge rating={item.rating} reviewCount={item.reviewCount} className="shrink-0" />
        </div>
        <h3 className="mt-1.5 font-display text-xl font-semibold leading-snug text-primary">
          <Link href={item.href} className="outline-none hover:underline focus-visible:underline">
            {item.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{item.location}</span>
          {item.price && (
            <>
              <span aria-hidden className="opacity-40">·</span>
              <span className="font-medium">{item.price}</span>
            </>
          )}
        </p>
        {item.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
        )}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={item.href} />}>
            View details
          </Button>
          <AddToItineraryButton place={toItineraryPlace(item)} size="sm" />
        </div>
      </div>
    </article>
  );
}
