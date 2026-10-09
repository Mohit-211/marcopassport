"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { CalendarDays, Check, Clock, MapPin, Plus, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/data/trip-planner";
import { priceLabel } from "@/lib/trip-planner/trip-utils";
import { cn } from "@/lib/utils";
import type { PlannerItem } from "@/types/trip";

interface ItemCardProps {
  item: PlannerItem;
  active?: boolean;
  /** Already on the day items are being added to */
  added?: boolean;
  addLabel?: string;
  onSelect?: () => void;
  onAdd?: () => void;
  compact?: boolean;
}

export const ItemCard = forwardRef<HTMLElement, ItemCardProps>(function ItemCard(
  { item, active, added, addLabel, onSelect, onAdd, compact },
  ref,
) {
  const DateIcon = item.date ? CalendarDays : Clock;

  return (
    <article
      ref={ref}
      data-active={active}
      onClick={onSelect}
      className={cn(
        "group relative flex gap-3 rounded-2xl border bg-card p-3 shadow-soft transition-all duration-200",
        onSelect && "cursor-pointer hover:border-brand-primary/40 hover:shadow-elegant",
        active ? "border-brand-primary shadow-soft ring-2 ring-brand-primary/20" : "border-border",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl bg-brand-primary-tint",
          compact ? "size-16" : "h-24 w-24 sm:h-28 sm:w-28",
        )}
      >
        <Image
          src={item.image}
          alt=""
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.topPick && !compact && (
          <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-brand-primary-tint px-1.5 py-0.5 text-[10px] font-semibold text-brand-primary shadow-sm">
            <Star className="size-2.5 fill-gold text-gold-foreground/70" aria-hidden />
            Top pick
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-brand-primary">
          {categoryLabel(item.category)}
          <span aria-hidden className="text-primary/30">
            •
          </span>
          <span className="normal-case tracking-normal text-primary/60">
            <span className="sr-only">Price: </span>
            {priceLabel(item.priceLevel)}
          </span>
        </div>

        <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-primary">
          {onSelect ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              aria-pressed={active}
              className="rounded text-left outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50"
            >
              {item.name}
              <span className="sr-only">, show on map</span>
            </button>
          ) : (
            item.name
          )}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <DateIcon className="size-3.5 shrink-0" aria-hidden />
          {item.hours}
        </p>
        {!compact && (
          <>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{item.address}</span>
            </p>
            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-primary/75">
              {item.description}
            </p>
          </>
        )}

        {onAdd && (
          <div className="mt-auto flex justify-end pt-2">
            <Button
              size="sm"
              variant={added ? "secondary" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                onAdd?.();
              }}
              className={cn("h-8 gap-1.5 px-3", !added && "bg-brand-primary hover:bg-brand-primary-hover text-white")}
            >
              {added ? <Check aria-hidden /> : <Plus aria-hidden />}
              {added ? "Added" : addLabel}
              <span className="sr-only">: {item.name}</span>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
});
