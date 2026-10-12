"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { hasPlace } from "../logic";
import { useItineraries } from "../ItinerariesProvider";
import { MAX_ITINERARY_PLACES, type ItineraryPlace } from "../types";
import { NewItineraryDialog } from "./NewItineraryDialog";

type Size = "sm" | "default" | "lg";

const addedClass = "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800";

/**
 * "Add to itinerary" for place and listing pages.
 * - Signed in: pick one of the user's itineraries, or start a new one with this place.
 * - Guest: adds to the local draft, saved to the account after login.
 * Shows "Added" once the place is in any itinerary (or the draft).
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
  /** Shorter label for tight spots such as the mobile action bar */
  compactLabel?: boolean;
}) {
  const router = useRouter();
  const { ready, isAuthenticated, itineraries, loading, isAdded, addToDraft, addToItinerary, createItinerary } =
    useItineraries();
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const added = ready && isAdded(place.id);
  const label = compactLabel ? "Add" : "Add to itinerary";

  if (!ready || (isAuthenticated && loading)) {
    return (
      <Button variant="gold" size={size} disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" /> {label}
      </Button>
    );
  }

  if (!isAuthenticated) {
    return added ? (
      <Button variant="outline" size={size} className={cn(addedClass, className)} onClick={() => router.push("/passport")}>
        <Check className="h-4 w-4" /> Added
      </Button>
    ) : (
      <Button variant="gold" size={size} className={className} onClick={() => addToDraft(place)}>
        <Plus className="h-4 w-4" /> {label}
      </Button>
    );
  }

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={busy}
          className={cn(
            buttonVariants({ variant: added ? "outline" : "gold", size }),
            added && addedClass,
            className,
          )}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {added ? "Added" : label}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-w-[min(20rem,calc(100vw-2rem))]">
          <DropdownMenuLabel>
            <span className="text-xs font-medium text-muted-foreground">Add to which itinerary?</span>
          </DropdownMenuLabel>
          {itineraries.map((itinerary) => {
            const inIt = hasPlace(itinerary.items ?? [], place.id);
            const full = (itinerary.item_count ?? itinerary.items?.length ?? 0) >= MAX_ITINERARY_PLACES;
            return (
              <DropdownMenuItem
                key={itinerary.id}
                disabled={full && !inIt}
                onClick={() =>
                  inIt
                    ? router.push(`/passport/${itinerary.id}`)
                    : void run(() => addToItinerary(itinerary.id, place))
                }
                className="justify-between"
              >
                <span className="flex min-w-0 items-center gap-2">
                  {inIt ? <Check className="text-emerald-600" /> : <span className="size-4" aria-hidden />}
                  <span className="truncate">{itinerary.name}</span>
                </span>
                {(inIt || full) && (
                  <span className="shrink-0 text-xs text-muted-foreground">{inIt ? "Added · Open" : "Full"}</span>
                )}
              </DropdownMenuItem>
            );
          })}
          {itineraries.length > 0 && <DropdownMenuSeparator />}
          <DropdownMenuItem onClick={() => setCreating(true)}>
            <Plus /> New itinerary
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NewItineraryDialog
        open={creating}
        onOpenChange={setCreating}
        placeName={place.name}
        onCreate={async (name) => {
          const itinerary = await createItinerary({ name, items: [{ place_id: place.id, visit_date: null }] });
          if (!itinerary) return false;
          toast.success(`Added to ${itinerary.name}`, {
            description: place.name,
            action: { label: "Open", onClick: () => router.push(`/passport/${itinerary.id}`) },
          });
          return true;
        }}
      />
    </>
  );
}
