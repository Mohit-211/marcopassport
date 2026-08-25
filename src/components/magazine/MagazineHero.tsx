import Image from "next/image";
import { BookOpen } from "lucide-react";
import { magazines } from "@/data/magazines";

export default function MagazineHero({
  featured,
}: {
  featured: (typeof magazines)[number];
}) {
  return (
    <section className="relative isolate h-[78vh] overflow-hidden bg-primary text-primary-foreground">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/assets/places-hero.jpg"
          alt=""
          aria-hidden
          fill
          priority
          className="object-cover object-center blur-sm scale-110"
          sizes="100vw"
        />
      </div>
      {/* Image treatment */}
      <div className="absolute inset-0 -z-10 bg-primary/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/85 via-primary/40 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/70 via-transparent to-primary/10" />

      {/* Subtle pattern */}
      <svg
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="mag-dots"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2"
              cy="2"
              r="1"
              fill="currentColor"
              className="text-gold"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mag-dots)" />
      </svg>

      {/* Content */}
      <div className="mx-auto flex h-full max-w-7xl items-center px-6 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-5 sm:text-[11px]">
            <span className="h-px w-8 bg-gold/70" />
            <BookOpen className="h-3.5 w-3.5" /> The publication
          </div>

          {/* Heading */}
          <h1 className="font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
            Marco <span className="italic text-gold">Magazine</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
            A seasonal, print-quality collection of stories, photo essays and
            field guides — written by the people who live, sail and cook on
            Marco Island.
          </p>

          {/* Meta line */}
          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-primary-foreground/70 sm:mt-8">
            <span>{magazines.length} editions</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>Long-form · Photography · Guides</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>New issue every season</span>
          </div>
        </div>
      </div>

      {/* Decorative covers row */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-8%] top-1/2 hidden -translate-y-1/2 gap-6 opacity-80 lg:flex"
      >
        {magazines.slice(0, 3).map((m, i) => (
          <div
            key={m.slug}
            className="relative aspect-[2/3] w-44 overflow-hidden rounded-md shadow-elegant ring-1 ring-primary-foreground/10"
            style={{
              transform: `translateY(${i * 16}px) rotate(${(i - 1) * 4}deg)`,
            }}
          >
            <img src={m.cover} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}
