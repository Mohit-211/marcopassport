import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { categories } from "@/data/content";

export function Categories() {
  return (
    <section className="container mx-auto px-5 py-20 lg:px-8 md:py-28">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em]">
            Browse the island
          </p>

          <h2 className="mt-2 font-display text-4xl font-semibold text-balance md:text-5xl">
            Explore by category
          </h2>
        </div>

        <p className="max-w-md text-muted-foreground">
          From sun-soaked resorts to hidden seafood shacks. Every recommendation
          is hand-picked.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href="/explore"
            className={`group relative overflow-hidden rounded-3xl shadow-soft transition-all duration-500 hover:shadow-elegant ${
              index === 0
                ? "col-span-2 row-span-2 aspect-square lg:col-span-2 lg:aspect-auto"
                : "aspect-[4/5]"
            }`}
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-90" />

            <div className="absolute inset-0 flex flex-col justify-end p-5 text-primary-foreground md:p-6">
              <span className="text-gold text-xs font-medium">
                {category.count} listings
              </span>

              <h3 className="mt-1 font-display text-xl font-semibold md:text-2xl">
                {category.name}
              </h3>

              <p className="mt-1 hidden line-clamp-2 text-sm text-primary-foreground/80 md:block">
                {category.description}
              </p>

              <span className="mt-3 inline-flex -translate-y-1 items-center gap-1 text-xs font-medium text-gold opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                Browse
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
