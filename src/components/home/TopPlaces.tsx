import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { topPlaces } from "@/data/content";

export function TopPlaces() {
  return (
    <section className="container mx-auto px-5 py-20 lg:px-8 md:py-28">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em]">
            Editor&apos;s Picks
          </p>

          <h2 className="mt-2 max-w-2xl font-display text-4xl font-semibold text-balance md:text-5xl">
            Top Places to Visit on Marco Island
          </h2>
        </div>

        <Link
          href="/places"
          className="group inline-flex items-center gap-2 font-medium text-primary transition hover:text-gold"
        >
          See the Full List
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3 md:gap-6">
        {topPlaces.map((place, index) => (
          <article key={place.name} className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src={place.image}
                alt={place.name}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute top-5 left-5 grid h-10 w-10 place-items-center rounded-full bg-background/95 font-display font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>

            <h3 className="mt-5 font-display text-2xl font-semibold transition-colors group-hover:text-primary">
              {place.name}
            </h3>

            <p className="mt-2 leading-relaxed text-muted-foreground">
              {place.blurb}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
