"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetRelatesPlaceByCategoryId } from "@/api/users/places.api";
import { mapPlaceToCard, type PlaceCard } from "@/lib/place";
import type { ApiPlace } from "@/types/place";

type NearbyAndRelatedProps = {
  categoriesId?: number;
  currentSlug?: string;
};

export default function NearbyAndRelated({
  categoriesId,
  currentSlug,
}: NearbyAndRelatedProps) {
  const [related, setRelated] = useState<PlaceCard[]>([]);
  console.log(related, "related")
  useEffect(() => {
    if (!categoriesId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await GetRelatesPlaceByCategoryId(categoriesId);
        const list=res?.data?.data?.places;
      
        setRelated(list)

      } catch (error) {
        console.error("Failed to fetch related places:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categoriesId, currentSlug]);

  if (related.length === 0) return null;
  console.log(related, "related")
  return (
    <>
      <section className="container mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              From the journal
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance">
              Related reads
            </h2>
          </div>
          <Link href="/blog" className="hidden md:inline-block">
            <Button variant="ghost">
              All articles <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {related.map((b) => (
            <Link
              key={b.slug}
              // href="/blog"
              href={`/places/${b.slug}`}
              className="group block rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-elegant transition-all duration-500"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                 
                     src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${b.featured_image}`}
                  alt={b.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {/* {b.updated_at} */}
                      {b.updated_at
                    ? new Date(b.updated_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    : ""}
                </p>
                <h3 className="font-display text-xl font-semibold mt-2 text-balance group-hover:text-primary transition-colors">
                  {b.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {b.short_description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
