"use client";

import { MapPin } from "lucide-react";
import type { ExploreItem } from "@/lib/explore";
import { useSettled } from "../components/ItineraryMap";
import { embedMapSrc } from "../maps";

const MAP_DEBOUNCE_MS = 800;
const MARCO_ISLAND_STOP = { name: "Marco Island", address: "Florida" };

/**
 * The planner's map, using the same free Maps Embed iframe as My Passport
 * (see ../maps.ts): the selected listing when one is picked from the
 * results, otherwise the plan's driving route through its stops in visiting
 * order (Google draws the real road route), otherwise Marco Island.
 * An iframe can't show a pin per result or report clicks, so selection only
 * happens from the list.
 */
export function PlannerMap({
  items,
  stops,
  selectedId,
}: {
  items: ExploreItem[];
  /** Plan stops in visiting order */
  stops: ExploreItem[];
  selectedId: number | null;
  onSelect?: (id: number) => void;
}) {
  const selected = items.find((i) => i.id === selectedId);
  const places = selected ? [selected] : stops.length > 0 ? stops : [MARCO_ISLAND_STOP];
  const src = useSettled(embedMapSrc(places, "driving"), MAP_DEBOUNCE_MS);

  return (
    <div className="relative h-full min-h-60 w-full bg-muted">
      {src ? (
        <iframe
          key={src}
          src={src}
          title="Map of places"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div>
            <MapPin className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The map isn&apos;t set up yet. You can still browse and add places from the list.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
