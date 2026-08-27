import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlaceCard as PlaceCardData } from "@/lib/place";

function PlaceCard({
  place,
  index,
}: {
  place: PlaceCardData;
  index: number;
}) {
  return (
    <Link
      href={`/places/${place.slug}`}
      className="group relative aspect-[16/9] overflow-hidden rounded-3xl block shadow-soft hover:shadow-elegant transition-all duration-500"
    >
      <img
        src={place.image}
        alt={place.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/15 to-transparent" />
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500" />

      <div className="absolute top-5 left-5 flex items-center gap-2">
        <span className="bg-background/90 text-foreground text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full">
          {place.tag}
        </span>
        {place.featured && (
          <span className="bg-gold text-gold-foreground text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full">
            ★ Top
          </span>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
        <span className="text-[11px] uppercase tracking-[0.2em] text-gold/90">
          № {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-2xl md:text-3xl font-semibold mt-1 leading-tight">
          {place.name}
        </h3>
        <p className="text-sm text-primary-foreground/85 mt-2 line-clamp-2 max-w-md">
          {place.blurb}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-gold opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          Explore more <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}

export default function PlacesGrid({ places }: { places: PlaceCardData[] }) {
  if (places.length === 0) {
    return (
      <section className="containermx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-28">
        <p className="text-center text-muted-foreground">
          No places to show right now — check back soon.
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="flex items-end justify-between gap-4 mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
            The collection
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 text-balance">
            Places to Explore and Enjoy
          </h2>
        </div>
        <Link href="/explore" className="hidden md:inline-block">
          <Button variant="outline">Browse the directory</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {places.map((p, i) => (
          <PlaceCard key={p.id} place={p} index={i} />
        ))}
      </div>
    </section>
  );
}