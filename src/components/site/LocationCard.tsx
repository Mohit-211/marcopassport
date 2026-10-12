import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { directionsToUrl, embedMapSrc, placeSearchUrl } from "@/features/itineraries/maps";

/**
 * Where a listing is: a free Google Maps Embed of its name + address, and
 * plain Maps links for directions. Same no-cost approach as the itinerary
 * map (see features/itineraries/maps.ts).
 */
export function LocationCard({ name, address }: { name: string; address: string | null | undefined }) {
  const stop = { name, address };
  const src = embedMapSrc([stop]);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      {src ? (
        <iframe
          src={src}
          title={`Map showing ${name}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[16/9] w-full border-0 bg-muted"
        />
      ) : (
        <div className="grid aspect-[16/7] place-items-center bg-cream">
          <MapPin className="h-8 w-8 text-gold" />
        </div>
      )}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <MapPin className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="font-medium text-primary">{name}</p>
            <p className="text-sm text-muted-foreground">{address || "Marco Island, FL"}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            variant="default"
            size="sm"
            nativeButton={false}
            render={<a href={directionsToUrl(stop)} target="_blank" rel="noopener noreferrer" />}
          >
            <Navigation className="h-3.5 w-3.5" /> Directions
          </Button>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<a href={placeSearchUrl(stop)} target="_blank" rel="noopener noreferrer" />}
          >
            <ExternalLink className="h-3.5 w-3.5" /> Google Maps
          </Button>
        </div>
      </div>
    </div>
  );
}
