import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { magazines } from "@/data/content";

export function MagazineStrip() {
  return (
    <section className="overflow-hidden bg-primary py-20 text-primary-foreground md:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em]">
              The Print Edition
            </p>

            <h2 className="mt-2 max-w-xl font-display text-4xl font-semibold text-balance md:text-5xl">
              Marco Passport, the Magazine
            </h2>

            <p className="mt-4 max-w-lg text-primary-foreground/75">
              Coastal lifestyle, deep dives into local culture, and the season's
              best openings, collected in a print-quality digital edition.
            </p>
          </div>

          <Link href="/magazine">
            <Button variant="gold" size="lg">
              Browse All Issues
            </Button>
          </Link>
        </div>
      </div>

      <div className="marquee-mask overflow-x-auto scrollbar-none">
        <div className="flex snap-x snap-mandatory gap-6 px-5 pb-6 lg:gap-10 lg:px-8">
          {magazines.map((magazine, index) => (
            <article
              key={`${magazine.title}-${index}`}
              className="group w-56 shrink-0 cursor-pointer snap-start md:w-72"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-elegant transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
                <Image
                  src={magazine.cover}
                  alt={`${magazine.title} ${magazine.issue}`}
                  fill
                  sizes="(max-width:768px) 224px, 288px"
                  className="object-cover"
                />
              </div>

              <div className="mt-4">
                <p className="text-gold text-xs uppercase tracking-widest">
                  {magazine.issue}
                </p>

                <h3 className="mt-1 font-display text-xl">{magazine.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
