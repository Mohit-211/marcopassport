import Image from "next/image";
import { Compass } from "lucide-react";

export default function PlacesHero({ total }: { total: number }) {
  return (
    <section className="relative isolate h-[78vh] overflow-hidden bg-primary text-primary-foreground">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/assets/places-hero.jpg"
          alt="Aerial sunset view of Marco Island white sand beach with turquoise Gulf water"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      {/* Image treatment */}
      <div className="absolute inset-0 -z-10 bg-primary/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/85 via-primary/40 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/70 via-transparent to-primary/10" />

      {/* Content */}
      <div className="mx-auto flex h-full max-w-7xl items-center px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-5 sm:text-[11px]">
            <span className="h-px w-8 bg-gold/70" />
            <Compass className="h-3.5 w-3.5" />
            Places to Visit
          </div>
          
          {/* Heading */}

          <h1 className="font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
            Discover <span className="italic text-gold">Marco Island</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
            Explore the beaches, landmarks, natural spaces, scenic spots, and
            local favorites that make Marco Island worth discovering.
          </p>
          {/* Meta line */}
          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-primary-foreground/70 sm:mt-8">
            <span>{total} places to explore</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>Beaches · Nature · Landmarks · Views</span>
          </div>
        </div>
      </div>
    </section>
  );
}
