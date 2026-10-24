"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Compass, RotateCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroMeta, PageHero } from "@/components/site/PageHero";
import { ExploreCard } from "@/components/explore/ExploreCard";
import { EmptyState } from "@/components/explore/ExploreHelpers";
import { fetchExploreItems, type ExploreResult } from "@/api/users/explore.api";
import { matchesSearch, type ExploreItem } from "@/lib/explore";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export interface ExploreInitialState {
  query?: string;
  /** A category slug from a link such as /explore?category=beaches */
  category?: string;
}

type Load =
  | { status: "loading" }
  | { status: "error" }
  | ({ status: "ready" } & ExploreResult);

interface CategoryChip {
  slug: string;
  name: string;
  count: number;
}

/** Featured first, then the team's top picks, then the best rated, then A–Z. */
function recommended(a: ExploreItem, b: ExploreItem) {
  return (
    Number(b.featured) - Number(a.featured) ||
    Number(b.topPick) - Number(a.topPick) ||
    (b.rating ?? 0) - (a.rating ?? 0) ||
    a.name.localeCompare(b.name)
  );
}

/**
 * /explore — every beach, restaurant, stay and shop in one list. Whether a
 * place is a business doesn't matter here: the search and one row of
 * category chips do the filtering, and featured places come first.
 */
export function ExplorePage({ initial = {} }: { initial?: ExploreInitialState }) {
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState(initial.query ?? "");
  const [category, setCategory] = useState<string | null>(initial.category ?? null);
  const [shown, setShown] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    fetchExploreItems()
      .then((result) => {
        if (!cancelled) setLoad({ status: "ready", ...result });
      })
      .catch(() => {
        if (!cancelled) setLoad({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const items = useMemo(() => (load.status === "ready" ? load.items : []), [load]);

  // Every category with how many places are in it. A slug used for both
  // places to visit and businesses is one chip.
  const categories = useMemo<CategoryChip[]>(() => {
    const bySlug = new Map<string, CategoryChip>();
    for (const item of items) {
      for (const slug of new Set(item.categories.map((c) => c.slug))) {
        const name = item.categories.find((c) => c.slug === slug)!.name;
        const chip = bySlug.get(slug) ?? { slug, name, count: 0 };
        chip.count += 1;
        bySlug.set(slug, chip);
      }
    }
    return [...bySlug.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [items]);

  // A ?category= link to a category that no longer exists shows everything.
  const selected = categories.some((c) => c.slug === category) ? category : null;

  // Keep the search and category in the URL so the view can be shared or bookmarked.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Links from before the redesign may still carry these; they do nothing now.
    params.delete("type");
    params.delete("featured");
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    if (category) params.set("category", category);
    else params.delete("category");
    const next = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${next ? `?${next}` : ""}`);
  }, [query, category]);

  const results = useMemo(
    () =>
      items
        .filter(
          (item) =>
            (!selected || item.categories.some((c) => c.slug === selected)) && matchesSearch(item, query),
        )
        .sort(recommended),
    [items, selected, query],
  );
  const visible = results.slice(0, shown);

  const pick = (slug: string | null) => {
    setCategory(slug);
    setShown(PAGE_SIZE);
  };
  const clearAll = () => {
    setQuery("");
    pick(null);
  };
  const retry = () => {
    setLoad({ status: "loading" });
    setReloadKey((k) => k + 1);
  };

  return (
    <>
      <PageHero
        size="compact"
        image="/assets/explore-hero.jpg"
        imageAlt="Marco Island marina at golden hour with yachts and palm trees"
        icon={Compass}
        eyebrow="Explore"
        title={
          <>
            Explore <span className="italic text-gold">Marco Island</span>
          </>
        }
        description="Beaches, landmarks and nature spots, plus the restaurants, stays and shops locals recommend. Add anything to your passport straight from the list."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShown(PAGE_SIZE);
            document.getElementById("explore-results")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex max-w-2xl flex-col gap-2 rounded-card bg-background/95 p-2 shadow-elegant backdrop-blur sm:flex-row sm:rounded-full"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShown(PAGE_SIZE);
              }}
              type="search"
              aria-label="Search places"
              placeholder="Search beaches, restaurants, activities…"
              className="flex-1 bg-transparent py-3 text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" variant="gold" size="lg">
            Search
          </Button>
        </form>
        {load.status === "ready" && (
          <div className="mt-6" aria-live="polite">
            {/* The results start below the hero, so a search confirms its count up here. */}
            <HeroMeta
              items={
                query.trim()
                  ? [`${results.length} ${results.length === 1 ? "result" : "results"} for “${query.trim()}”`]
                  : [`${items.length} places to explore`, "Beaches · Dining · Stays · Activities"]
              }
            />
          </div>
        )}
      </PageHero>

      <section id="explore-results" className="scroll-mt-(--header-height)">
        {/* Category chips stay under the navbar while the results scroll. */}
        <div className="sticky top-(--header-height) z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="site-container flex items-center gap-4 py-3">
            <div
              role="group"
              aria-label="Filter by category"
              className="scrollbar-none -mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 py-0.5"
            >
              {load.status === "loading" ? (
                Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-10 w-28 shrink-0 rounded-full" />)
              ) : (
                <>
                  <CategoryButton label="All" count={items.length} active={!selected} onClick={() => pick(null)} />
                  {categories.map((c) => (
                    <CategoryButton
                      key={c.slug}
                      label={c.name}
                      count={c.count}
                      active={selected === c.slug}
                      onClick={() => pick(selected === c.slug ? null : c.slug)}
                    />
                  ))}
                </>
              )}
            </div>
            {load.status === "ready" && (
              <p className="hidden shrink-0 text-sm text-muted-foreground md:block">
                <span className="font-semibold text-foreground">{results.length}</span>{" "}
                {results.length === 1 ? "place" : "places"}
              </p>
            )}
          </div>
        </div>

        <div className="site-container py-10 md:py-14">
          {query.trim() && load.status === "ready" && (
            <p className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "result" : "results"} for
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={`Clear the search for ${query.trim()}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary py-1 pr-2 pl-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                “{query.trim()}” <X className="h-3 w-3" />
              </button>
            </p>
          )}

          {load.status === "ready" && load.partial && (
            <p className="mb-6 flex items-center gap-2 rounded-card bg-sand px-4 py-3 text-sm text-primary">
              <AlertTriangle className="h-4 w-4 shrink-0 text-gold" />
              Some places couldn&apos;t be loaded right now.
              <button type="button" className="font-medium underline" onClick={retry}>
                Retry
              </button>
            </p>
          )}

          {load.status === "loading" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading places">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="overflow-hidden rounded-card border border-border bg-card">
                  <Skeleton className="aspect-[16/10] rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Skeleton className="h-9 rounded-full" />
                      <Skeleton className="h-9 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : load.status === "error" ? (
            <div className="rounded-card border border-border bg-card p-12 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-gold" />
              <p className="mt-3 font-semibold text-primary">We couldn&apos;t load places right now.</p>
              <Button variant="outline" className="mt-5" onClick={retry}>
                <RotateCw className="h-4 w-4" /> Try again
              </Button>
            </div>
          ) : results.length === 0 ? (
            <EmptyState clearAction={clearAll} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item) => (
                <ExploreCard key={`${item.type}:${item.id}`} item={item} />
              ))}
            </div>
          )}

          {results.length > visible.length && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <Button variant="outline" size="lg" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                Show more places
              </Button>
              <p className="text-sm text-muted-foreground">
                Showing {visible.length} of {results.length}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function CategoryButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary",
      )}
    >
      {label}
      <span className={cn("text-xs tabular-nums", active ? "text-gold" : "text-muted-foreground")}>{count}</span>
    </button>
  );
}
