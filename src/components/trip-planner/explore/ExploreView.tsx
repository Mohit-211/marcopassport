"use client";

import { useMemo, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { List, Map as MapIcon, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PLANNER_ITEMS } from "@/data/trip-planner";
import { toDayKey } from "@/lib/trip-planner/trip-utils";
import { cn } from "@/lib/utils";
import type { CategoryId, Interest, PlannerItem, PriceLevel } from "@/types/trip";
import { ItemCard } from "../ItemCard";
import { MapView, type MapPoint } from "../map/MapView";
import {
  DateRangeFilter,
  FiltersPopover,
  SortSelect,
  type SortId,
} from "./ExploreFilters";

function sortItems(items: PlannerItem[], sort: SortId) {
  const list = [...items];
  switch (sort) {
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "price-asc":
      return list.sort((a, b) => a.priceLevel - b.priceLevel);
    case "price-desc":
      return list.sort((a, b) => b.priceLevel - a.priceLevel);
    case "date":
      // Dated events first, soonest first; everything else keeps its order
      return list.sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"));
    default:
      return list.sort((a, b) => Number(!!b.topPick) - Number(!!a.topPick));
  }
}

interface ExploreViewProps {
  query?: string;
  category?: CategoryId | null;
}

export function ExploreView({ query = "", category = null }: ExploreViewProps) {

  const [sort, setSort] = useState<SortId>("recommended");
  const [range, setRange] = useState<DateRange | undefined>();
  const [prices, setPrices] = useState<PriceLevel[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"list" | "map">("list");
  const cardRefs = useRef(new Map<string, HTMLElement>());

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = range?.from ? toDayKey(range.from) : null;
    const to = range?.to ? toDayKey(range.to) : from;

    const filtered = PLANNER_ITEMS.filter((item) => {
      if (category === "top-picks" ? !item.topPick : category && item.category !== category) {
        return false;
      }
      if (q && ![item.name, item.description, item.address].some((t) => t.toLowerCase().includes(q))) {
        return false;
      }
      if (from && to && item.date && (item.date < from || item.date > to)) return false;
      if (prices.length && !prices.includes(item.priceLevel)) return false;
      if (interests.length && !item.interests.some((i) => interests.includes(i))) return false;
      return true;
    });
    return sortItems(filtered, sort);
  }, [category, interests, prices, query, range, sort]);

  const points = useMemo<MapPoint[]>(
    () => items.map((i) => ({ id: i.id, lat: i.lat, lng: i.lng, title: i.name })),
    [items],
  );

  const hasFilters = !!range?.from || prices.length > 0 || interests.length > 0;
  const activeItem = items.find((i) => i.id === activeId) ?? null;

  const selectFromMap = (id: string) => {
    setActiveId(id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() =>
      cardRefs.current
        .get(id)
        ?.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" }),
    );
  };

  const renderCard = (item: PlannerItem, compact = false) => (
    <ItemCard
      key={item.id}
      ref={(el) => {
        if (compact) return;
        if (el) cardRefs.current.set(item.id, el);
        else cardRefs.current.delete(item.id);
      }}
      item={item}
      compact={compact}
      active={!compact && item.id === activeId}
      onSelect={compact ? undefined : () => setActiveId(item.id)}
    />
  );

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      {/* Mobile list/map switch */}
      <div
        role="tablist"
        aria-label="Explore view"
        className="flex gap-1 border-b border-border bg-white p-2 md:hidden"
      >
        {(
          [
            ["list", "List", List],
            ["map", "Map", MapIcon],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`explore-tab-${id}`}
            aria-selected={mobileTab === id}
            aria-controls={`explore-panel-${id}`}
            onClick={() => setMobileTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50",
              mobileTab === id ? "bg-brand-primary text-white" : "text-primary/70",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {/* List panel */}
      <section
        id="explore-panel-list"
        aria-labelledby="explore-tab-list"
        className={cn(
          "min-h-0 flex-1 flex-col border-border bg-brand-page md:flex md:w-[420px] md:flex-none md:border-r lg:w-[460px]",
          mobileTab === "list" ? "flex" : "hidden",
        )}
      >
        <div className="space-y-2.5 border-b border-border bg-white p-3 sm:px-4">
          <div className="flex flex-wrap items-center gap-2">
            <SortSelect value={sort} onChange={setSort} />
            <DateRangeFilter value={range} onChange={setRange} />
            <FiltersPopover
              prices={prices}
              onPricesChange={setPrices}
              interests={interests}
              onInterestsChange={setInterests}
            />
          </div>
        </div>

        <p className="px-4 pt-3 text-xs text-muted-foreground" aria-live="polite">
          {items.length} {items.length === 1 ? "place" : "places"}
        </p>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6 pt-2 sm:px-4">
          {items.length > 0 ? (
            <div className="flex flex-col gap-3">{items.map((item) => renderCard(item))}</div>
          ) : (
            <div className="mt-10 flex flex-col items-center text-center">
              <SearchX className="size-8 text-brand-primary/40" aria-hidden />
              <p className="mt-3 font-medium text-primary">Nothing matches just yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Try a different category or search, or loosen your filters.
              </p>
              {hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setRange(undefined);
                    setPrices([]);
                    setInterests([]);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Map panel */}
      <section
        id="explore-panel-map"
        aria-labelledby="explore-tab-map"
        className={cn("relative min-h-0 flex-1 md:block", mobileTab === "map" ? "block" : "hidden")}
      >
        <MapView
          className="h-full"
          label="Map of places"
          points={points}
          activeId={activeId}
          onSelect={selectFromMap}
        />
        {mobileTab === "map" && activeItem && (
          <div className="absolute inset-x-3 bottom-28 md:hidden">{renderCard(activeItem, true)}</div>
        )}
      </section>
    </div>
  );
}
