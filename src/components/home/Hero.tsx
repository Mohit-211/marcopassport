import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden -mt-20 pt-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/hero-marco-island.jpg"
          alt="Aerial sunset view of Marco Island beach with turquoise water and palm trees"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-grad-hero" />
      </div>

      {/* Content */}
      <div className="container mx-auto flex min-h-[calc(100svh-80px)] items-center px-5 py-24 lg:px-8">
        <div className="max-w-3xl text-primary-foreground">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-gold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Marco Island, Florida
          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-balance md:text-7xl">
            Your <span className="italic text-gold">passport</span> to the
            island.
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg text-primary-foreground/85 md:text-xl">
            A curated directory of the finest places to stay, eat, explore and
            savor on Marco Island, designed for travelers who want it all in one
            elegant journey.
          </p>

          {/* Search */}
          <div className="mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl bg-background/95 p-2 shadow-elegant backdrop-blur sm:flex-row">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search restaurants, resorts, activities..."
                className="flex-1 bg-transparent py-3 text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="hidden items-center gap-2 border-l border-border px-3 text-sm text-muted-foreground sm:flex">
              <MapPin className="h-4 w-4" />
              Marco Island
            </div>

            <Link
              href="/explore"
              className={buttonVariants({
                variant: "gold",
                size: "lg",
              })}
            >
              Explore
            </Link>
          </div>

          {/* Trending */}
          <div className="mt-8 flex flex-wrap gap-2 text-sm text-primary-foreground/80">
            <span className="opacity-60">Trending:</span>

            {[
              "Sunset dining",
              "Beachfront resorts",
              "Dolphin tours",
              "Stone crab",
            ].map((item) => (
              <Link
                key={item}
                href="/explore"
                className="rounded-full border border-primary-foreground/25 px-3 py-1 transition-colors hover:border-gold hover:bg-gold hover:text-gold-foreground"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
