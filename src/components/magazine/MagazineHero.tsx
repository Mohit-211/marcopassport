import { BookOpen } from "lucide-react";
import { magazines } from "@/data/magazines";

export default function MagazineHero({
  featured,
}: {
  featured: (typeof magazines)[number];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 -z-10 opacity-25">
        <img
          src="/assets/places-hero.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.22_0.06_240/0.7),oklch(0.22_0.06_240/0.95))]" />
      </div>
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
      <div className="container mx-auto px-5 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-gold">
            <BookOpen className="h-3.5 w-3.5" /> The publication
          </div>
          <h1 className="mt-6 font-display text-6xl md:text-8xl font-semibold leading-[0.95] text-balance">
            Marco <span className="italic text-gold">Magazine</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl">
            A seasonal, print-quality collection of stories, photo essays and
            field guides — written by the people who live, sail and cook on
            Marco Island.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-primary-foreground/70">
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
        className="pointer-events-none absolute right-[-8%] top-1/2 -translate-y-1/2 hidden lg:flex gap-6 opacity-80"
      >
        {magazines.slice(0, 3).map((m, i) => (
          <div
            key={m.slug}
            className="relative w-44 aspect-[2/3] rounded-md overflow-hidden shadow-elegant ring-1 ring-primary-foreground/10"
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
