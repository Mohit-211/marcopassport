"use client";

import { MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NormalizedItem } from "../types";
import { SOURCE_STYLES, SourceBadge } from "./SourceBadge";

interface PlaceCardProps {
  item: NormalizedItem;
  onSelect: (item: NormalizedItem) => void;
  highlighted?: boolean;
  /** Footer slot, e.g. an AddToTripButton */
  actions?: React.ReactNode;
}

/** Card for a place or business; clicking it opens the item details. */
export function PlaceCard({ item, onSelect, highlighted, actions }: PlaceCardProps) {
  const accent = item.source === "places" ? "border-t-sky-500" : "border-t-amber-500";
  const { Icon } = SOURCE_STYLES[item.source];

  return (
    <li
      id={`item-${item.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-t-4 border-border bg-card shadow-sm transition-all hover:shadow-md",
        accent,
        highlighted && "ring-4 ring-gold/60",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="flex flex-1 flex-col text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`View details for ${item.name}`}
      >
        <div className="relative h-40 overflow-hidden bg-muted">
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow">
            <Icon className="h-4 w-4 text-primary" aria-hidden />
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-center justify-between gap-2">
            <SourceBadge source={item.source} />
            {item.rating !== null && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#002E50]">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {item.rating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EBBD00]">{item.category}</p>
          <h3 className="font-display text-lg font-semibold leading-snug text-[#002E50]">{item.name}</h3>
          {item.address && (
            <p className="inline-flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{item.address}</span>
            </p>
          )}
        </div>
      </button>
      {actions && <div className="px-4 pb-4">{actions}</div>}
    </li>
  );
}
