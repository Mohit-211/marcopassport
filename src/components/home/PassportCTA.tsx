import Link from "next/link";
import { Calendar, Heart, MapPin, Share2 } from "lucide-react";

const features = [
  {
    icon: Heart,
    label: "Save favorites",
  },
  {
    icon: Calendar,
    label: "Plan your dates",
  },
  {
    icon: MapPin,
    label: "Map your stops",
  },
  {
    icon: Share2,
    label: "Share your trip",
  },
];

export function PassportCTA() {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-10 sm:py-16 md:px-16 md:py-20">
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Your Marco Passport
            </p>

            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-balance sm:text-4xl md:text-5xl">
              Build your island itinerary, one place at a time.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-6 text-primary-foreground/70 sm:text-base">
              Save the places you love, plan when to visit them, and turn
              everything into one beautiful itinerary you can share.
            </p>

            <Link
              href="/passport"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground transition-transform hover:-translate-y-0.5"
            >
              Start my Passport
            </Link>
          </div>

          {/* Features */}
          <div className="relative mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-primary-foreground/10 pt-8 sm:grid-cols-4 sm:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.label} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-gold" />

                  <span className="text-sm text-primary-foreground/80">
                    {feature.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
