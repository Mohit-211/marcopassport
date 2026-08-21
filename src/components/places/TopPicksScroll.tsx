import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { PlaceCard } from "@/lib/place";

export default function TopPicksScroll({ places }: { places: PlaceCard[] }) {
  const topPicks = places.filter((p) => p.isTopPick);

  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-20 relative">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              <Sparkles className="inline h-3.5 w-3.5 -mt-0.5 mr-1" /> Must-see
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 text-balance">
              Top picks of the season
            </h2>
          </div>
          <p className="text-primary-foreground/70 max-w-md text-sm">
            Looking for somewhere to start? These are a few places we think
            deserve a spot on your Marco Island itinerary.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-6 px-5 lg:px-8 container mx-auto min-w-max">
          {topPicks.map((p, i) => (
            <Link
              key={p.id}
              href={`/places/${p.slug}`}
              className="group relative w-[320px] md:w-[420px] shrink-0 rounded-3xl overflow-hidden shadow-elegant"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-gold text-gold-foreground text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
                ★ Top pick · {String(i + 1).padStart(2, "0")}
              </span>
              <div className="absolute bottom-6 left-6 right-6 text-primary-foreground">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold/90">
                  {p.tag}
                </p>
                <h3 className="font-display text-3xl md:text-4xl font-semibold mt-1 leading-tight">
                  {p.name}
                </h3>
                <p className="text-sm text-primary-foreground/85 mt-2 line-clamp-2">
                  {p.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
