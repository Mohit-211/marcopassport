"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Map as MapIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { embedMapSrc, routeUrl, type TravelMode } from "../maps";
import type { PassportPlace } from "../types";

// Rebuild the iframe only once edits settle, not on every drag or keystroke.
const MAP_DEBOUNCE_MS = 800;

export function useSettled<T>(value: T, delay: number) {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return settled;
}

/**
 * The passport map: one Google Maps Embed iframe with lettered pins (A, B, C…)
 * and the route in visiting order. Embed maps are free; see ../maps.ts for
 * why no other Google API is used. On phones it stays behind a "Show map"
 * toggle so the iframe only loads when someone actually wants it.
 */
export function PassportMap({
  places,
  mode,
  onModeChange,
  className,
}: {
  places: PassportPlace[];
  mode: TravelMode;
  onModeChange: (mode: TravelMode) => void;
  className?: string;
}) {
  const isMobile = useIsMobile();
  const [shownOnMobile, setShownOnMobile] = useState(false);
  const src = useSettled(embedMapSrc(places, mode), MAP_DEBOUNCE_MS);
  const fullRoute = routeUrl(places, mode);
  const visible = !isMobile || shownOnMobile;

  return (
    <section
      aria-label="Passport map"
      className={cn(
        "rounded-card border border-border bg-card p-3 shadow-soft",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-3">
        <div
          role="radiogroup"
          aria-label="Travel mode"
          className="inline-flex rounded-full bg-muted p-1"
        >
          {(["driving", "walking"] as const).map((m) => (
            <Tooltip key={m} content={`Draw the route and directions for ${m}`}>
              <button
                type="button"
                role="radio"
                aria-checked={mode === m}
                onClick={() => onModeChange(m)}
                className={cn(
                  "rounded-full px-3.5 py-1 text-xs font-medium capitalize transition-colors",
                  mode === m
                    ? "bg-background text-primary shadow-soft"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                {m}
              </button>
            </Tooltip>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {fullRoute && (
            <Tooltip content="Opens every stop in Google Maps. On phones Google may show fewer stops, so use the Directions links between stops for long trips.">
              <a
                href={fullRoute}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Open route in Google Maps <ExternalLink className="h-3 w-3" />
              </a>
            </Tooltip>
          )}
          {isMobile && places.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShownOnMobile((s) => !s)}
              aria-expanded={shownOnMobile}
            >
              <MapIcon className="h-3.5 w-3.5" />{" "}
              {shownOnMobile ? "Hide map" : "Show map"}
            </Button>
          )}
        </div>
      </div>

      {places.length === 0 ? (
        <Placeholder text="Add places to see them on the map." />
      ) : !src ? (
        <Placeholder text="The map isn't available right now. Use the directions links instead." />
      ) : (
        visible && (
          <iframe
            key={src}
            src={src}
            title="Map of your passport"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="aspect-[4/3] w-full rounded-tile border-0 bg-muted lg:aspect-auto lg:h-[min(70vh,640px)]"
          />
        )
      )}
    </section>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="grid aspect-[4/3] place-items-center rounded-tile bg-muted/60 p-6 text-center lg:aspect-auto lg:h-[min(70vh,640px)]">
      <div>
        <MapPin className="mx-auto h-8 w-8 text-gold" />
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
