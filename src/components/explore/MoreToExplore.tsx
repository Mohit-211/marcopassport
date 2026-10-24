"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GetAllBusinessApi } from "@/api/users/business.api";
import { GetAllPlacesApi } from "@/api/users/places.api";
import { ExploreCard } from "@/components/explore/ExploreCard";
import { toExploreItem, type ExploreItem, type ExploreType } from "@/lib/explore";
import type { ApiExploreCategory, ApiExploreItem } from "@/types/explore";

const SHOWN = 3;

/** "More like this" under a place: others in its first category. */
export function MoreToExplore({
  type,
  category,
  currentSlug,
}: {
  type: ExploreType;
  category?: ApiExploreCategory;
  currentSlug: string;
}) {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const categoryId = category?.id;

  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    // A category belongs to one of the API's two lists, so ask that one.
    const fetchList = type === "place" ? GetAllPlacesApi : GetAllBusinessApi;
    // One extra in case the current place is among the results.
    fetchList({ category_id: categoryId, limit: SHOWN + 1 })
      .then((res) => {
        if (cancelled) return;
        const list: ApiExploreItem[] = res?.data?.data?.places ?? [];
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
            <p className="eyebrow text-gold">Keep exploring</p>
            <h2 className="mt-2 text-3xl font-semibold text-primary md:text-4xl">More like this</h2>
          </div>
          <Link
            href={category ? `/explore?category=${category.slug}` : "/explore"}
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
