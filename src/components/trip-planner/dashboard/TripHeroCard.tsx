"use client";

import Image from "next/image";
import { Link2, MoreHorizontal, Pencil, Plus, Printer, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateRange, nightsBetween } from "@/lib/trip-planner/trip-utils";
import { cn } from "@/lib/utils";
import type { Trip } from "@/types/trip";

const roundButton = cn(
  "grid size-9 place-items-center rounded-full bg-white/95 text-foreground shadow-md transition-colors",
  "hover:bg-white outline-none focus-visible:ring-3 focus-visible:ring-white/80",
);

/** Photo header for the itinerary panel. Hidden actions: pass no handler. */
export function TripHeroCard({
  trip,
  coverImage,
  readOnly,
  onEdit,
  onShare,
  onPrint,
  onNewTrip,
  onDelete,
}: {
  trip: Trip;
  /** Usually the first planned stop's photo */
  coverImage?: string;
  readOnly?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  onPrint: () => void;
  onNewTrip?: () => void;
  onDelete?: () => void;
}) {
  const image = coverImage ?? "/assets/hero-marco-island.jpg";
  const nights = nightsBetween(trip.startDate, trip.endDate);

  return (
    <div className="relative h-44 overflow-hidden rounded-xl bg-muted shadow-soft print:h-auto print:overflow-visible print:shadow-none">
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 768px) 400px, 100vw"
        className="object-cover print:hidden"
        priority
        unoptimized={image.startsWith("http")}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent print:hidden" />

      <div className="absolute right-2.5 top-2.5 flex gap-2 print:hidden">
        {!readOnly && onEdit && (
          <button type="button" className={roundButton} onClick={onEdit} aria-label="Edit trip" title="Edit trip">
            <Pencil className="size-4" aria-hidden />
          </button>
        )}
        {onShare && (
          <button type="button" className={roundButton} onClick={onShare} aria-label="Share trip" title="Share trip">
            <Link2 className="size-4" aria-hidden />
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className={roundButton} aria-label="More trip options">
            <MoreHorizontal className="size-4" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onPrint}>
              <Printer className="size-4" aria-hidden /> Print itinerary
            </DropdownMenuItem>
            {!readOnly && (
              <>
                {onNewTrip && (
                  <DropdownMenuItem onClick={onNewTrip}>
                    <Plus className="size-4" aria-hidden /> New trip
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={onDelete}>
                      <Trash2 className="size-4" aria-hidden /> Delete trip
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3.5 text-white print:static print:p-0 print:text-foreground">
        <p className="font-display text-lg font-medium leading-tight">{trip.name}</p>
        <p className="mt-0.5 text-xs text-white/85 print:text-muted-foreground">
          {formatDateRange(trip.startDate, trip.endDate)} · {nights} {nights === 1 ? "night" : "nights"}
        </p>
      </div>
    </div>
  );
}
