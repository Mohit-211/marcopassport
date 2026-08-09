import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { topPlaces } from "@/data/content";

export function TopPlaces() {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary/60">
              Editor's Picks
            </p>

            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-primary sm:text-4xl md:text-5xl">
              Top Places to Visit on Marco Island
            </h2>
          </div>

          <Link
            href="/places"
            className="group hidden shrink-0 items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-gold sm:inline-flex"
          >
            See the full list
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Places */}
        <div className="grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-10">
          {topPlaces.map((place, index) => (
            <Link key={place.name} href="/places" className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Minimal number */}
                <span className="absolute left-4 top-4 font-display text-sm font-semibold text-white drop-shadow-md">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="pt-5">
                <h3 className="font-display text-xl font-semibold text-primary sm:text-2xl">
                  {place.name}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {place.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <Link
          href="/places"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary sm:hidden"
        >
          See the full list
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
