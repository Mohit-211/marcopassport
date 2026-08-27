"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { PlaceCard } from "@/lib/place";
import { GetAllBusinessByCategoryIdApi } from "@/api/users/business.api";


function blogDate(dateString?: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
type NearbyAndRelatedProps = {
  categoriesId?: number;
  currentSlug?: string;
};
export default function SimilarAndRelated({
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
        const res = await GetAllBusinessByCategoryIdApi(categoriesId);
        const list = res?.data?.data?.places;
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
      {/* Related reads */}
      <section className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              Related reads
            </p>
            <h2 className="font-display text-4xl font-semibold mt-2">
              From the journal
            </h2>
          </div>
          <Link href="/blog" className="hidden sm:inline-block">
            <Button variant="ghost">All stories</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {related.map((p) => (
            <Link
              key={`${p.slug}-${p.id}`}
              href={`/listings/${p.slug}`}
              className="group block"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-2xl">
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${p.featured_image}`}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {/* {b.updated_at} */}
                  {p.updated_at
                    ? new Date(p.updated_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    : ""}
                </p>
              </p>
              <h3 className="font-display text-xl font-semibold mt-1 group-hover:text-primary transition">
                {p.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {p.short_description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}