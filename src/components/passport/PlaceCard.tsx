"use client";

import { ImageOff, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Place } from "@/utils/normalizePlace";

export function PlaceCard({
  place,
  selected,
  onSelect,
  onViewOnMap,
}: {
  place: Place;
  selected: boolean;
  onSelect: () => void;
  /** Omitted when the place has no coordinates */
  onViewOnMap?: () => void;
}) {
  return (
    <li
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-[#002E50]/5 transition-all hover:shadow-md",
        selected && "ring-3 ring-[#EBBD00]",
      )}
    >
      <div className="relative h-40 bg-muted">
        {place.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={place.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground">
            <ImageOff className="h-8 w-8" aria-label="No image" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EBBD00]">{place.category}</p>
        <h3 className="font-display text-lg font-semibold leading-snug text-[#002E50]">
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className="text-left outline-none focus-visible:underline"
          >
            {place.name}
          </button>
        </h3>
        {place.address && (
          <p className="inline-flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {place.address}
          </p>
        )}
        <p className="inline-flex items-center gap-1 text-sm text-[#002E50]">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          {place.rating !== null ? (
            place.rating.toFixed(1)
          ) : (
            <span className="text-muted-foreground">No rating yet</span>
          )}
        </p>
        <div className="mt-auto pt-3">
          {onViewOnMap ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewOnMap();
              }}
            >
              <MapPin className="h-3.5 w-3.5" /> View on map
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">Location not available</span>
          )}
        </div>
      </div>
    </li>
  );
}
