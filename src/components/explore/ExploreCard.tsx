"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { AddToPassportButton } from "@/features/passport/components/AddToPassportButton";
import { toPassportPlace, type ExploreItem } from "@/lib/explore";
import { cn } from "@/lib/utils";

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

/** A place on Explore and the home page: details link plus "Add to passport". */
export function ExploreCard({ item }: { item: ExploreItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant">
      <Link href={item.href} className="relative block aspect-[16/10] overflow-hidden bg-muted" tabIndex={-1} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-primary/45 to-transparent" />
        {item.featured && (
          <Tooltip content="Hand-picked by the Marco Passport team.">
            <span className="caps absolute top-4 left-4 rounded-full bg-background/95 px-2.5 py-1 text-primary shadow-soft">
              ★ Featured
            </span>
          </Tooltip>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {(item.category || item.rating !== null) && (
          <div className="flex items-center justify-between gap-3">
            <p className="caps truncate text-gold">{item.category}</p>
            <RatingBadge rating={item.rating} reviewCount={item.reviewCount} className="shrink-0" />
          </div>
        )}
        <h3 className="mt-1.5 text-xl leading-snug font-semibold text-primary">
          <Link href={item.href} className="outline-none hover:underline focus-visible:underline">
            {item.name}
          </Link>
        </h3>
        {(item.location || item.price) && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            {item.location && (
              <>
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{item.location}</span>
              </>
            )}
            {item.location && item.price && <span aria-hidden className="opacity-40">·</span>}
            {item.price && <span className="font-medium">{item.price}</span>}
          </p>
        )}
        {item.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
        )}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={item.href} />}>
            View details
          </Button>
          <AddToPassportButton place={toPassportPlace(item)} size="sm" />
        </div>
      </div>
    </article>
  );
}
