"use client";

import { useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useItineraries } from "../ItinerariesProvider";
import type { ItineraryPlace } from "../types";
import { AddToItineraryDialog } from "./AddToItineraryDialog";

type Size = "sm" | "default" | "lg";

const addedClass = "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800";

/**
 * "Add to itinerary" on Explore cards and detail pages. Opens a small popup to
 * pick a visit date and an itinerary. Shows "Added" once the place is in any
 * of the user's itineraries (or the guest draft); it can still be added to
 * another itinerary from there.
 */
export function AddToItineraryButton({
  place,
  size = "default",
  className,
  compactLabel,
}: {
  place: ItineraryPlace;
  size?: Size;
  className?: string;
  /** Shorter label for tight spots such as cards and the mobile action bar */
  compactLabel?: boolean;
}) {
  const { ready, isAuthenticated, loading, isAdded } = useItineraries();
  const [open, setOpen] = useState(false);
  const busy = !ready || (isAuthenticated && loading);
  const added = !busy && isAdded(place.id);

  return (
    <>
      <Button
        type="button"
        variant={added ? "outline" : "gold"}
        size={size}
        disabled={busy}
        onClick={() => setOpen(true)}
        className={cn(added && addedClass, className)}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {added ? "Added" : compactLabel ? "Add" : "Add to itinerary"}
      </Button>
      <AddToItineraryDialog place={place} open={open} onOpenChange={setOpen} />
    </>
  );
}
