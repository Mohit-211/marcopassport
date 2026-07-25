"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
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
import { FilterPanel } from "@/components/explore/FilterPanel";
import { ListingCard, allListings } from "@/components/explore/ListingCard";
import { ActiveChip, EmptyState } from "@/components/explore/ExploreHelpers";
import { cn } from "@/lib/utils";

type SortOption = "featured" | "popular" | "rating" | "recent";

const PAGE_SIZE = 9;

export function ExplorePage() {
  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedHoods, setSelectedHoods] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = allListings.filter((l) => {
      if (
        query &&
        !`${l.name} ${l.description} ${l.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      if (selectedCats.length && !selectedCats.includes(l.category))
        return false;
      if (selectedPrices.length && !selectedPrices.includes(l.price))
        return false;
      if (
        selectedHoods.length &&
        !selectedHoods.some((h) => l.location.includes(h))
      )
        return false;
      if (minRating && l.rating < minRating) return false;
      if (featuredOnly && !l.featured) return false;
      return true;
    });

    switch (sort) {
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        list = [...list].sort((a, b) => b.rating * 10 - a.rating * 10);
        break;
      case "recent":
        list = [...list].reverse();
        break;
      case "featured":
      default:
        list = [...list].sort(
          (a, b) => Number(b.featured) - Number(a.featured)
        );
    }
    return list;
  }, [
    query,
    selectedCats,
    selectedPrices,
    selectedHoods,
    minRating,
    featuredOnly,
    sort,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const activeFilterCount =
    selectedCats.length +
    selectedPrices.length +
    selectedHoods.length +
    (featuredOnly ? 1 : 0) +
    (minRating ? 1 : 0);

  const clearAll = () => {
    setSelectedCats([]);
    setSelectedPrices([]);
    setSelectedHoods([]);
    setMinRating(0);
    setFeaturedOnly(false);
    setQuery("");
    setPage(1);
  };

  const filterPanel = (
    <FilterPanel
      selectedCats={selectedCats}
      onToggleCat={(c) => {
        setPage(1);
        setSelectedCats((p) =>
          p.includes(c) ? p.filter((x) => x !== c) : [...p, c]
        );
      }}
      selectedPrices={selectedPrices}
      onTogglePrice={(p) => {
        setPage(1);
        setSelectedPrices((prev) =>
          prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );
      }}
      selectedHoods={selectedHoods}
      onToggleHood={(h) => {
        setPage(1);
        setSelectedHoods((prev) =>
          prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
        );
      }}
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
      activeCount={activeFilterCount}
      onClear={clearAll}
    />
  );

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="/assets/explore-hero.jpg"
            alt="Marco Island marina at golden hour with yachts and palm trees"
            width={1920}
            height={768}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.22_0.06_240/0.85),oklch(0.22_0.06_240/0.65)_60%,oklch(0.22_0.06_240/0.9))]" />
        </div>
        <div className="container mx-auto px-5 lg:px-8 pt-28 pb-16 md:pt-32 md:pb-20 text-primary-foreground">
          <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
            Directory
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold mt-3 text-balance max-w-3xl">
            Explore Marco Island
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-primary-foreground/80">
            Every listing is hand-vetted. Filter by category, price and
            neighborhood — and bookmark what you love.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
            }}
            className="mt-8 flex flex-col sm:flex-row gap-2 bg-background/95 backdrop-blur p-2 rounded-2xl shadow-elegant max-w-2xl"
          >
            <div className="flex items-center flex-1 gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search businesses, categories or keywords…"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground py-3"
              />
            </div>
            <Button type="submit" variant="gold" size="lg">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Main */}
      <section className="container mx-auto px-5 lg:px-8 py-10 md:py-14">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-soft">
              {filterPanel}
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="ml-1 inline-grid place-items-center h-5 min-w-5 px-1.5 rounded-full bg-gold text-gold-foreground text-[11px] font-bold">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[88vw] sm:w-[400px] overflow-y-auto"
                  >
                    <SheetHeader>
                      <SheetTitle className="font-display text-2xl">
                        Filters
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">{filterPanel}</div>
                  </SheetContent>
                </Sheet>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  listing
                  {filtered.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  Sort by
                </span>
                <Select
                  value={sort}
                  onValueChange={(v: SortOption | null) => {
                    if (v) setSort(v);
                  }}
                >
                  <SelectTrigger className="w-[180px] rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured first</SelectItem>
                    <SelectItem value="popular">Most popular</SelectItem>
                    <SelectItem value="rating">Highest rated</SelectItem>
                    <SelectItem value="recent">Recently added</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {selectedCats.map((c) => (
                  <ActiveChip
                    key={c}
                    label={c}
                    onRemove={() =>
                      setSelectedCats((p) => p.filter((x) => x !== c))
                    }
                  />
                ))}
                {selectedPrices.map((p) => (
                  <ActiveChip
                    key={p}
                    label={p}
                    onRemove={() =>
                      setSelectedPrices((prev) => prev.filter((x) => x !== p))
                    }
                  />
                ))}
                {selectedHoods.map((h) => (
                  <ActiveChip
                    key={h}
                    label={h}
                    onRemove={() =>
                      setSelectedHoods((prev) => prev.filter((x) => x !== h))
                    }
                  />
                ))}
                {minRating > 0 && (
                  <ActiveChip
                    label={`${minRating}+ stars`}
                    onRemove={() => setMinRating(0)}
                  />
                )}
                {featuredOnly && (
                  <ActiveChip
                    label="Featured only"
                    onRemove={() => setFeaturedOnly(false)}
                  />
                )}
                <button
                  onClick={clearAll}
                  className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-primary transition ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {pageItems.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {pageItems.map((l) => (
                  <ListingCard key={l.id} listing={l} />
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
                  className="rounded-full"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={cn(
                        "h-10 min-w-10 px-3 rounded-full text-sm font-semibold transition",
                        n === safePage
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      aria-current={n === safePage ? "page" : undefined}
                    >
                      {n}
                    </button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-full"
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
