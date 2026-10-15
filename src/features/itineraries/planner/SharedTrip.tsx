"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItineraryMap } from "../components/ItineraryMap";
import { formatDateRange } from "../format";
import { directionsUrl, stopLetter, type TravelMode } from "../maps";
import { placeHref, placeImage } from "../place";
import type { ItineraryItem } from "../types";

/**
 * A shared trip, read-only: the stops in order with their days, and the same
 * route map My Passport uses. Nothing here can edit anyone's itinerary.
 */
export function SharedTrip({
  name,
  startDate,
  endDate,
  items,
  missing,
}: {
  name: string;
  startDate: string | null;
  endDate: string | null;
  items: ItineraryItem[];
  /** Stops in the link that no longer exist */
  missing: number;
}) {
  const [mode, setMode] = useState<TravelMode>("driving");
  const places = items.map((item) => item.place);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
      <div className="min-w-0 space-y-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">{name}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> {formatDateRange(startDate, endDate)} · {items.length}{" "}
            {items.length === 1 ? "stop" : "stops"}
          </p>
        </div>

        {missing > 0 && (
          <p className="rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
            {missing} {missing === 1 ? "place in this trip is" : "places in this trip are"} no longer listed.
          </p>
        )}

        {items.length === 0 ? (
          <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">This trip has no places.</p>
        ) : (
          <ol className="space-y-2">
            {items.map((item, index) => {
              const href = placeHref(item.place);
              const next = items[index + 1];
              return (
                <li key={item.place_id} className="rounded-2xl border border-border bg-card p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-xs font-bold text-gold-foreground">
                      {stopLetter(index)}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={placeImage(item.place.featured_image)} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      {href ? (
                        <Link href={href} className="block truncate font-semibold text-primary hover:underline">
                          {item.place.name}
                        </Link>
                      ) : (
                        <p className="truncate font-semibold text-primary">{item.place.name}</p>
                      )}
                      {item.place.address && (
                        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" /> {item.place.address}
                        </p>
                      )}
                    </div>
                    {item.visit_date && (
                      <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-primary">
                        {formatDateRange(item.visit_date, item.visit_date)}
                      </span>
                    )}
                  </div>
                  {next && (
                    <a
                      href={directionsUrl(item.place, next.place, mode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 ml-10 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Directions to {stopLetter(index + 1)} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        <Button variant="gold" nativeButton={false} render={<Link href="/passport" />}>
          Plan your own trip
        </Button>
      </div>

      <ItineraryMap places={places} mode={mode} onModeChange={setMode} />
    </div>
  );
}
