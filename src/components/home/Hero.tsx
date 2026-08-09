import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate min-h-dvh overflow-hidden bg-primary text-primary-foreground">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/assets/hero-marco-island.jpg"
          alt="Marco Island coastline"
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
      <div className="mx-auto flex min-h-dvh max-w-7xl items-center px-6 py-28 sm:px-8 sm:py-32 lg:px-10">
        <div className="translate-y-8 max-w-2xl sm:translate-y-10 lg:translate-y-12">
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
          <div className="mt-8 sm:mt-9">
            <Link
              href="/explore"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-5 py-3 text-sm font-medium text-gold-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold"
            >
              Explore the island
              <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
