"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Compass,
  RotateCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoTip } from "@/components/ui/tooltip";
import { HeroMeta, PageHero } from "@/components/site/PageHero";
import { ExploreCard } from "@/components/explore/ExploreCard";
import {
  ExploreFilters,
  type CategoryOption,
} from "@/components/explore/ExploreFilters";
import { ActiveChip, EmptyState } from "@/components/explore/ExploreHelpers";
import { fetchExploreItems, type ExploreResult } from "@/api/users/explore.api";
import {
  EXPLORE_TYPE_LABELS,
  PRICE_LEVELS,
  matchesSearch,
  type ExploreItem,
  type ExploreType,
} from "@/lib/explore";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | ExploreType;
type SortOption = "featured" | "rating" | "name";

const PAGE_SIZE = 12;

export interface ExploreInitialState {
  type?: TypeFilter;
  query?: string;
  /** A category slug from a link such as /explore?category=beaches */
  category?: string;
  featured?: boolean;
}

type Load =
  | { status: "loading" }
  | { status: "error" }
  | ({ status: "ready" } & ExploreResult);

const catKey = (type: ExploreType, slug: string) => `${type}:${slug}`;

function sortItems(list: ExploreItem[], sort: SortOption) {
  const byName = (a: ExploreItem, b: ExploreItem) =>
    a.name.localeCompare(b.name);
  if (sort === "name") return [...list].sort(byName);
  if (sort === "rating")
    return [...list].sort(
      (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || byName(a, b),
    );
  return [...list].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      Number(b.topPick) - Number(a.topPick) ||
      (b.rating ?? 0) - (a.rating ?? 0) ||
      byName(a, b),
  );
}

/**
 * /explore — places to visit and businesses in one list. A type switch
 * (All / Places to visit / Businesses) and category filters do the
 * separating, instead of two near-identical pages.
 */
export function ExplorePage({
  initial = {},
}: {
  initial?: ExploreInitialState;
}) {
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [type, setType] = useState<TypeFilter>(initial.type ?? "all");
  const [query, setQuery] = useState(initial.query ?? "");
  const [pendingCategory, setPendingCategory] = useState(
    initial.category ?? null,
  );
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [featuredOnly, setFeaturedOnly] = useState(initial.featured ?? false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const items = useMemo(
    () => (load.status === "ready" ? load.items : []),
    [load],
  );

  // A ?category=slug link selects every category with that slug once the list is in.
  if (pendingCategory && load.status === "ready") {
    setPendingCategory(null);
    setSelectedCats(
      Array.from(
        new Set(
          items.flatMap((i) =>
            i.categories
              .filter((c) => c.slug === pendingCategory)
              .map((c) => catKey(c.type, c.slug)),
          ),
        ),
      ),
    );
  }

  // Keep the type and search in the URL so the view can be shared or bookmarked.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (type === "all") params.delete("type");
    else params.set("type", type);
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    params.delete("category");
    const next = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${next ? `?${next}` : ""}`,
    );
  }, [type, query]);

  const ofType = useMemo(
    () => (type === "all" ? items : items.filter((i) => i.type === type)),
    [items, type],
  );

  const counts = useMemo(
    () => ({
      all: items.length,
      place: items.filter((i) => i.type === "place").length,
      business: items.filter((i) => i.type === "business").length,
    }),
    [items],
  );

  const categories = useMemo<CategoryOption[]>(() => {
    const map = new Map<string, CategoryOption>();
    for (const item of ofType) {
      for (const c of item.categories) {
        const key = catKey(c.type, c.slug);
        const entry = map.get(key) ?? {
          key,
          name: c.name,
          type: c.type,
          count: 0,
        };
        entry.count += 1;
        map.set(key, entry);
      }
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [ofType]);

  const prices = useMemo(
    () => PRICE_LEVELS.filter((p) => ofType.some((i) => i.price === p)),
    [ofType],
  );
  const hasRatings = useMemo(
    () => items.some((i) => i.rating !== null),
    [items],
  );

  const filtered = useMemo(() => {
    const list = ofType.filter((item) => {
      if (!matchesSearch(item, query)) return false;
      if (
        selectedCats.length &&
        !item.categories.some((c) =>
          selectedCats.includes(catKey(c.type, c.slug)),
        )
      )
        return false;
      if (
        selectedPrices.length &&
        !(item.price && selectedPrices.includes(item.price))
      )
        return false;
      if (minRating && (item.rating ?? 0) < minRating) return false;
      if (featuredOnly && !item.featured) return false;
      return true;
    });
    return sortItems(list, sort);
  }, [
    ofType,
    query,
    selectedCats,
    selectedPrices,
    minRating,
    featuredOnly,
    sort,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const activeCount =
    selectedCats.length +
    selectedPrices.length +
    (featuredOnly ? 1 : 0) +
    (minRating ? 1 : 0);

  const changeType = (next: TypeFilter) => {
    setType(next);
    setPage(1);
    // Drop filters that don't apply to the new type.
    if (next !== "all") {
      setSelectedCats((prev) => prev.filter((k) => k.startsWith(`${next}:`)));
      if (next === "place") setSelectedPrices([]);
    }
  };

  const clearAll = () => {
    setSelectedCats([]);
    setSelectedPrices([]);
    setMinRating(0);
    setFeaturedOnly(false);
    setQuery("");
    setPage(1);
  };

  const toggle =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (value: string) => {
      setPage(1);
      setter((prev) =>
        prev.includes(value)
          ? prev.filter((x) => x !== value)
          : [...prev, value],
      );
    };

  const filters = (
    <ExploreFilters
      categories={categories}
      selectedCats={selectedCats}
      onToggleCategory={toggle(setSelectedCats)}
      prices={prices}
      selectedPrices={selectedPrices}
      onTogglePrice={toggle(setSelectedPrices)}
      showRating={hasRatings}
      minRating={minRating}
      onMinRating={(v) => {
        setPage(1);
        setMinRating(v);
      }}
      featuredOnly={featuredOnly}
      onFeaturedOnly={(v) => {
        setPage(1);
        setFeaturedOnly(v);
      }}
      activeCount={activeCount}
      onClear={clearAll}
    />
  );

  const categoryName = (key: string) =>
    categories.find((c) => c.key === key)?.name ?? key.split(":")[1];

  return (
    <>
      <PageHero
        image="/assets/explore-hero.jpg"
        imageAlt="Marco Island marina at golden hour with yachts and palm trees"
        icon={Compass}
        eyebrow="Explore"
        title={
          <>
            Explore <span className="italic text-gold">Marco Island</span>
          </>
        }
        description="Beaches, landmarks and nature spots, plus the restaurants, stays and shops locals recommend. Add anything to your itinerary straight from the list."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            document
              .getElementById("explore-results")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex max-w-2xl flex-col gap-2 rounded-2xl bg-background/95 p-2 shadow-elegant backdrop-blur sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              type="search"
              aria-label="Search places and businesses"
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
            {/* The results sit below the fold, so a search confirms its count up here. */}
            <HeroMeta
              items={
                query.trim()
                  ? [
                      `${filtered.length} ${filtered.length === 1 ? "result" : "results"} for “${query.trim()}”`,
                    ]
                  : [
                      `${counts.place} places to visit`,
                      `${counts.business} businesses`,
                      "Beaches · Dining · Stays · Activities",
                    ]
              }
            />
          </div>
        )}
      </PageHero>

      <section
        id="explore-results"
        className="site-container scroll-mt-24 py-10 md:py-14"
      >
        {/* Type switch */}
        <div className="mb-8 flex items-center gap-3">
          <div
            role="tablist"
            aria-label="Show"
            className="flex w-full gap-1 overflow-x-auto rounded-full bg-muted p-1 sm:w-fit"
          >
            {(["all", "place", "business"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={type === t}
                onClick={() => changeType(t)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors sm:flex-none sm:px-5",
                  type === t
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                {t === "all" ? "All" : EXPLORE_TYPE_LABELS[t]}
                {load.status === "ready" && (
                  <span
                    className={cn(
                      "text-xs",
                      type === t ? "text-gold" : "text-muted-foreground/70",
                    )}
                  >
                    {counts[t]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <InfoTip
            label="About places and businesses"
            side="bottom"
          >
            <strong className="font-semibold">Places to visit</strong> are
            beaches, parks, landmarks and nature spots.{" "}
            <strong className="font-semibold">Businesses</strong> are
            restaurants, stays, shops, tours and services. Add either kind to
            your itinerary.
          </InfoTip>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-soft">
              {filters}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger
                    render={
                      <Button
                        variant="outline"
                        size="sm"
                        className="lg:hidden"
                      />
                    }
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeCount > 0 && (
                      <span className="ml-1 inline-grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-gold-foreground">
                        {activeCount}
                      </span>
                    )}
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[88vw] overflow-y-auto sm:w-[380px]"
                  >
                    <SheetHeader>
                      <SheetTitle className="sr-only">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="px-4 pb-6">{filters}</div>
                  </SheetContent>
                </Sheet>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  {filtered.length === 1 ? "result" : "results"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  Sort by
                </span>
                <Select
                  value={sort}
                  onValueChange={(v: SortOption | null) => {
                    if (v) setSort(v);
                  }}
                >
                  <SelectTrigger className="w-[170px] rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured first</SelectItem>
                    {hasRatings && (
                      <SelectItem value="rating">Highest rated</SelectItem>
                    )}
                    <SelectItem value="name">Name (A–Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeCount > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {selectedCats.map((k) => (
                  <ActiveChip
                    key={k}
                    label={categoryName(k)}
                    action={() => toggle(setSelectedCats)(k)}
                  />
                ))}
                {selectedPrices.map((p) => (
                  <ActiveChip
                    key={p}
                    label={p}
                    action={() => toggle(setSelectedPrices)(p)}
                  />
                ))}
                {minRating > 0 && (
                  <ActiveChip
                    label={`${minRating}+ stars`}
                    action={() => setMinRating(0)}
                  />
                )}
                {featuredOnly && (
                  <ActiveChip
                    label="Featured only"
                    action={() => setFeaturedOnly(false)}
                  />
                )}
                <button
                  onClick={clearAll}
                  className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-primary"
                >
                  Clear all
                </button>
              </div>
            )}

            {load.status === "ready" && load.failed.length > 0 && (
              <p className="mb-6 flex items-center gap-2 rounded-2xl bg-sand px-4 py-3 text-sm text-primary">
                <AlertTriangle className="h-4 w-4 shrink-0 text-gold" />
                {EXPLORE_TYPE_LABELS[load.failed[0]]} couldn&apos;t be loaded
                right now.
                <button
                  type="button"
                  className="font-medium underline"
                  onClick={() => setReloadKey((k) => k + 1)}
                >
                  Retry
                </button>
              </p>
            )}

            {load.status === "loading" ? (
              <div
                className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3"
                aria-busy="true"
                aria-label="Loading listings"
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-3xl border border-border bg-card"
                  >
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
              <div className="rounded-3xl border border-border bg-card p-12 text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-gold" />
                <p className="mt-3 font-semibold text-primary">
                  We couldn&apos;t load the listings.
                </p>
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => {
                    setLoad({ status: "loading" });
                    setReloadKey((k) => k + 1);
                  }}
                >
                  <RotateCw className="h-4 w-4" /> Try again
                </Button>
              </div>
            ) : pageItems.length === 0 ? (
              <EmptyState clearAction={clearAll} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
                {pageItems.map((item) => (
                  <ExploreCard key={`${item.type}:${item.id}`} item={item} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav
                className="mt-12 flex items-center justify-center gap-1"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  size="icon"
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={cn(
                        "h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition",
                        n === safePage
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted",
                      )}
                      aria-current={n === safePage ? "page" : undefined}
                    >
                      {n}
                    </button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
