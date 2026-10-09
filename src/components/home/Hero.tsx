import Link from "next/link";
import { ArrowDownRight, Sparkles } from "lucide-react";
import { HeroBackground } from "@/components/site/HeroBackground";

export function Hero() {
  return (
    <section className="hero-viewport">
      <HeroBackground src="/assets/hero-marco-island.jpg" alt="Marco Island coastline" />

      {/* Content */}
      <div className="hero-container">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-6 sm:text-[11px]">
            <span className="h-px w-8 bg-gold/70" />
            The Marco Passport
          </div>

          {/* Heading */}
          <h1 className="max-w-xl font-display text-[3.15rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-[4.75rem]">
            Your <span className="italic text-gold">passport</span>
            <br />
            to the island.
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-7 sm:text-base sm:leading-7">
            A thoughtful guide to Marco Island — the places worth discovering,
            the stories worth knowing, and the little things that make the
            island special.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-9">
            <Link
              href="/explore"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-5 py-3 text-sm font-medium text-gold-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold"
            >
              Explore the island
              <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
            <Link
              href="/my-trips"
              className="group inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/40 px-5 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground/10"
            >
              <Sparkles className="h-4 w-4" />
              Your Trips
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
