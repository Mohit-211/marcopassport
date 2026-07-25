import Image from "next/image";
import { Compass } from "lucide-react";
import { places } from "@/data/places";

export default function PlacesHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/places-hero.jpg"
          alt="Aerial sunset view of Marco Island white sand beach with turquoise Gulf water"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.22_0.06_240/0.6),oklch(0.22_0.06_240/0.35)_40%,oklch(0.22_0.06_240/0.9))]" />
      </div>
      <div className="container mx-auto px-5 lg:px-8 pt-32 pb-28 md:pt-44 md:pb-40 text-primary-foreground">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-gold">
            <Compass className="h-3.5 w-3.5" /> A locally-curated guide
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.05] text-balance">
            The island, <span className="text-gold italic">slowly</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl">
            Eight square miles of white sand, mangrove channels and Gulf-front
            secrets. These are the places worth crossing the bridge for — and
            the ones locals quietly return to.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-primary-foreground/70">
            <span>{places.length} hand-picked places</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>Beaches · Marinas · Wildlife · Sunsets</span>
          </div>
        </div>
      </div>
    </section>
  );
}
