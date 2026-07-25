import Image from "next/image";
import Link from "next/link";
import { Bookmark, ExternalLink, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { featuredListings } from "@/data/content";

export function FeaturedListings() {
  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em]">
              Hand-picked
            </p>

            <h2 className="mt-2 font-display text-4xl font-semibold text-balance md:text-5xl">
              Featured listings
            </h2>
          </div>

          <Link href="/explore">
            <Button variant="outline" size="lg">
              View all featured
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <article
              key={listing.id}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-500 hover:shadow-elegant"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={listing.image}
                  alt={listing.name}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <span className="absolute top-4 left-4 rounded-full bg-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-foreground shadow-gold">
                  ★ Featured
                </span>

                <button className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-gold hover:text-gold-foreground">
                  <Bookmark className="h-4 w-4" />
                </button>

                <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between text-primary-foreground">
                  <span className="rounded-full bg-primary/80 px-3 py-1 text-xs backdrop-blur">
                    {listing.category}
                  </span>

                  <span className="rounded-full bg-primary/80 px-3 py-1 text-xs font-medium backdrop-blur">
                    {listing.price}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 font-semibold text-gold">
                    <Star className="h-4 w-4 fill-current" />
                    {listing.rating}
                  </span>

                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {listing.location}
                  </span>
                </div>

                <h3 className="mt-2 font-display text-2xl font-semibold transition-colors group-hover:text-primary">
                  {listing.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {listing.description}
                </p>

                <div className="mt-5 flex gap-2">
                  <Link href={`/listings/${listing.id}`} className="flex-1">
                    <Button className="w-full">View Details</Button>
                  </Link>

                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
