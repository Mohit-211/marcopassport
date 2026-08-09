import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { magazines } from "@/data/content";

export function MagazineStrip() {
  return (
    <section className="overflow-hidden bg-primary px-4 py-16 text-primary-foreground sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Intro */}
        <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold">
              The Print Edition
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold text-balance sm:text-4xl md:text-5xl">
              The Marco Passport, the Magazine
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-primary-foreground/70 sm:text-base">
              Coastal lifestyle, local culture, and the season's best openings,
              collected in a print-quality digital edition.
            </p>
          </div>

          <Link
            href="/magazine"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-primary-foreground"
          >
            Browse all issues
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Covers */}
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none sm:gap-6 md:gap-8">
          {magazines.map((magazine, index) => (
            <Link
              key={`${magazine.title}-${index}`}
              href="/magazine"
              className="group w-[190px] shrink-0 sm:w-[220px] md:w-[250px]"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-background/10">
                <Image
                  src={magazine.cover}
                  alt={`${magazine.title} ${magazine.issue}`}
                  fill
                  sizes="(max-width: 640px) 190px, (max-width: 768px) 220px, 250px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gold/80">
                  {magazine.issue}
                </p>

                <h3 className="mt-1 font-display text-lg text-primary-foreground">
                  {magazine.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
