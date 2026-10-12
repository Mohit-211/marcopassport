"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GetAllBusinessApi } from "@/api/users/business.api";
import { GetAllPlacesApi } from "@/api/users/places.api";
import { ExploreCard } from "@/components/explore/ExploreCard";
import { toExploreItem, type ExploreItem, type ExploreType } from "@/lib/explore";
import type { ApiPlace } from "@/types/place";

const SHOWN = 3;

/** "More like this" under a place or business: same type, same first category. */
export function SimilarListings({
  type,
  categoryId,
  currentSlug,
}: {
  type: ExploreType;
  categoryId?: number;
  currentSlug: string;
}) {
  const [items, setItems] = useState<ExploreItem[]>([]);

  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    const fetchList = type === "place" ? GetAllPlacesApi : GetAllBusinessApi;
    // One extra in case the current listing is among the results.
    fetchList({ category_id: categoryId, limit: SHOWN + 1 })
      .then((res) => {
        if (cancelled) return;
        const list: ApiPlace[] = res?.data?.data?.places ?? [];
        setItems(
          list
            .filter((p) => p.slug !== currentSlug)
            .slice(0, SHOWN)
            .map((p) => toExploreItem(p, type)),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [type, categoryId, currentSlug]);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-border bg-background py-16 md:py-24">
      <div className="site-container">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Keep exploring</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
              {type === "place" ? "More places like this" : "Similar businesses"}
            </h2>
          </div>
          <Link
            href={`/explore?type=${type}`}
            className="group hidden shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:text-gold sm:inline-flex"
          >
            See all
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ExploreCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
