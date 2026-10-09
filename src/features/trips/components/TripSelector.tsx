"use client";

import { Check, ChevronDown, Plus, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { findTripItem } from "../trip-logic";
import { useTrips } from "../TripsProvider";
import type { NormalizedItem } from "../types";

/** Dropdown for choosing which trip to add an item to when there are several. */
export function TripSelector({
  item,
  className,
  size = "default",
}: {
  item: NormalizedItem;
  className?: string;
  size?: "sm" | "default";
}) {
  const { trips, addItem, removeItem, openCreateTrip } = useTrips();
  const savedCount = trips.filter((t) => findTripItem(t, item)).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: savedCount ? "outline" : "gold", size }),
          savedCount && "text-emerald-700 border-emerald-200 bg-emerald-50",
          className,
        )}
      >
        {savedCount ? (
          <>
            <Check className="h-4 w-4" /> Added
            {savedCount > 1 && ` (${savedCount})`}
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> Add to Trip
          </>
        )}
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-w-[min(20rem,calc(100vw-2rem))]">
        <DropdownMenuLabel>
          <span className="text-xs font-medium text-muted-foreground">Add to which trip?</span>
        </DropdownMenuLabel>
        {trips.map((trip) => {
          const existing = findTripItem(trip, item);
          return existing ? (
            <DropdownMenuItem
              key={trip.id}
              onClick={() => void removeItem(trip.id, existing.id)}
              className="justify-between"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Check className="text-emerald-600" />
                <span className="truncate">{trip.name}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                Already in Trip · <X className="size-3" /> Remove
              </span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={trip.id} onClick={() => void addItem(trip.id, item)}>
              <span className="size-4" aria-hidden />
              <span className="truncate">{trip.name}</span>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openCreateTrip(item)}>
          <Plus /> Create New Trip
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
