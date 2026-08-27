"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
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
import { ListingCard, type Listing } from "@/components/explore/ListingCard";
import { ActiveChip, EmptyState } from "@/components/explore/ExploreHelpers";
import {
  GetAllBusinessApi,
  GetAllBusinessByCategoryApi,
} from "@/api/users/business.api";
import { mapBusinessToListing } from "@/lib/business";
import type { PlacesResponse } from "@/types/business";
import { cn } from "@/lib/utils";

type SortOption = "featured" | "popular" | "rating" | "recent";

const PAGE_SIZE = 9;

export function ExplorePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingsError, setListingsError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedHoods, setSelectedHoods] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoadingListings(true);
        setListingsError("");
        const res =
          selectedCats.length === 1
            ? await GetAllBusinessByCategoryApi(selectedCats[0])
            : await GetAllBusinessApi();
        const payload: PlacesResponse = res?.data?.data ?? {};
        const responseData = payload.places ?? [];
        if (!Array.isArray(responseData)) {
          console.error(
            "Business API did not return an array:",
            responseData
          );
          setListings([]);
          setListingsError("Unable to load listings.");
          return;
        }
        setListings(responseData.map(mapBusinessToListing));
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
        setListings([]);
        setListingsError("Failed to load listings.");
      } finally {
        setLoadingListings(false);
      }
    };
    fetchListings();
  }, [selectedCats]);

  const filtered = useMemo(() => {
    let list = listings.filter((l) => {
      if (
        query &&
        !`${l.name} ${l.description} ${l.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      if (selectedCats.length && !selectedCats.includes(l.categorySlug))
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
    listings,
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
      toggleCategoryAction={(c: string) => {
        setPage(1);
        setSelectedCats((p) =>
          p.includes(c) ? p.filter((x) => x !== c) : [...p, c]
        );
      }}
      selectedPrices={selectedPrices}
      togglePriceAction={(p: string) => {
        setPage(1);
        setSelectedPrices((prev) =>
          prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );
      }}
      selectedHoods={selectedHoods}
      toggleNeighborhoodAction={(h: string) => {
        setPage(1);
        setSelectedHoods((prev) =>
          prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
        );
      }}
      minRating={minRating}
      setMinRatingAction={(v: number) => {
        setPage(1);
        setMinRating(v);
      }}
      featuredOnly={featuredOnly}
      setFeaturedOnlyAction={(v: boolean) => {
        setPage(1);
        setFeaturedOnly(v);
      }}
      activeCount={activeFilterCount}
      clearFiltersAction={clearAll}
    />
  );

  return (
    <>
      {/* Hero */}
      <section className="relative isolate h-[78vh] overflow-hidden bg-primary text-primary-foreground">
        {/* Background */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="/assets/explore-hero.jpg"
            alt="Marco Island marina at golden hour with yachts and palm trees"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        {/* Image treatment */}
        <div className="absolute inset-0 -z-10 bg-primary/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/85 via-primary/40 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/70 via-transparent to-primary/10" />

        {/* Content */}
        <div className="mx-auto flex h-full max-w-7xl items-center px-6 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-5 sm:text-[11px]">
              <span className="h-px w-8 bg-gold/70" />
              <MapPin className="h-3.5 w-3.5" />
              Directory
            </div>

            {/* Heading */}

            <h1 className="font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
              Explore <span className="italic text-gold">Marco Island</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
              Every listing is hand-vetted. Filter by category, price and
              neighborhood — and bookmark what you love.
            </p>

            {/* Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
              }}
              className="mt-6 flex max-w-2xl flex-col gap-2 rounded-2xl bg-background/95 p-2 shadow-elegant backdrop-blur sm:mt-7 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search businesses, categories or keywords…"
                  className="flex-1 bg-transparent py-3 text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button type="submit" variant="gold" size="lg">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="container mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
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
                    action={() =>
                      setSelectedCats((p) => p.filter((x) => x !== c))
                    }
                  />
                ))}
                {selectedPrices.map((p) => (
                  <ActiveChip
                    key={p}
                    label={p}
                    action={() =>
                      setSelectedPrices((prev) => prev.filter((x) => x !== p))
                    }
                  />
                ))}
                {selectedHoods.map((h) => (
                  <ActiveChip
                    key={h}
                    label={h}
                    action={() =>
                      setSelectedHoods((prev) => prev.filter((x) => x !== h))
                    }
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
                  className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-primary transition ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {loadingListings ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Loading listings...
              </p>
            ) : listingsError ? (
              <p className="py-16 text-center text-sm text-red-500">
                {listingsError}
              </p>
            ) : pageItems.length === 0 ? (
              <EmptyState clearAction={clearAll} />
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
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
