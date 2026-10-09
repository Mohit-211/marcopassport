"use client";

import { useState } from "react";
import { Check, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTrips } from "../TripsProvider";
import type { NormalizedItem } from "../types";
import { TripSelector } from "./TripSelector";

interface AddToTripButtonProps {
  item: NormalizedItem;
  className?: string;
  size?: "sm" | "default";
}

/**
 * Works on any page for any item source:
 * - no trips → opens "Create a Trip", then adds the item
 * - one trip → adds directly
 * - several trips → TripSelector dropdown (with "Create New Trip")
 * Once added it turns into "Added ✓" with a Remove action.
 */
export function AddToTripButton({ item, className, size = "default" }: AddToTripButtonProps) {
  const { trips, loading, tripsContaining, addItem, removeItem, openCreateTrip } = useTrips();
  const [busy, setBusy] = useState(false);
  const saved = tripsContaining(item);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Button variant="gold" size={size} disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" /> Add to Trip
      </Button>
    );
  }

  if (trips.length > 1) {
    return <TripSelector item={item} size={size} className={className} />;
  }

  if (trips.length === 1 && saved.length > 0) {
    const { trip, tripItem } = saved[0];
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <Button variant="outline" size={size} disabled aria-label={`Added to ${trip.name}`} className="disabled:opacity-100 text-emerald-700 border-emerald-200 bg-emerald-50">
          <Check className="h-4 w-4" /> Added
        </Button>
        <Button
          variant="ghost"
          size={size}
          disabled={busy}
          onClick={() => run(() => removeItem(trip.id, tripItem.id))}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" /> Remove
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="gold"
      size={size}
      disabled={busy}
      className={className}
      onClick={() =>
        trips.length === 0 ? openCreateTrip(item) : run(() => addItem(trips[0].id, item))
      }
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add to Trip
    </Button>
  );
}
