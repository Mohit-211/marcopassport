import Link from "next/link";
import { Calendar, Heart, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Heart,
    label: "Save Favorites",
    value: "Anywhere on the site",
  },
  {
    icon: Calendar,
    label: "Pick Your Dates",
    value: "Plan day by day",
  },
  {
    icon: MapPin,
    label: "Map Your Stops",
    value: "Routes, ordered",
  },
  {
    icon: Calendar,
    label: "Share With Friends",
    value: "One simple link",
  },
];

export function PassportCTA() {
  return (
    <section className="container mx-auto px-5 pb-20 lg:px-8 md:pb-28">
      <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:p-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden
        >
          <svg
            className="absolute -top-20 -right-20 h-96 w-96"
            viewBox="0 0 200 200"
          >
            <defs>
              <radialGradient id="passport-gradient" cx="50%" cy="50%">
                <stop offset="0%" stopColor="oklch(0.82 0.16 88)" />
                <stop offset="100%" stopColor="oklch(0.82 0.16 88 / 0)" />
              </radialGradient>
            </defs>

            <circle cx="100" cy="100" r="100" fill="url(#passport-gradient)" />
          </svg>
        </div>

        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em]">
              Your The Marco Passport
            </p>

            <h2 className="mt-3 font-display text-4xl font-semibold text-balance md:text-5xl">
              Build your island itinerary, one place at a time.
            </h2>

            <p className="mt-4 max-w-lg text-primary-foreground/80">
              Save your favorite spots, choose the dates and times you want to
              visit, and we'll turn them into a beautiful, shareable timeline.
              Your personal passport to Marco Island.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/passport">
                <Button variant="gold" size="lg">
                  Start My Passport
                </Button>
              </Link>

              <Link href="/explore">
                <Button variant="ghostLight" size="lg">
                  Browse Listings
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.label}
                  className="rounded-2xl border border-primary-foreground/10 bg-primary-soft/60 p-5 backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-gold" />

                  <p className="mt-3 font-display text-base">{feature.label}</p>

                  <p className="mt-1 text-xs text-primary-foreground/70">
                    {feature.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
