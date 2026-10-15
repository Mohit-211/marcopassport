"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Loader2, MapPin, Plane, RefreshCw, Search, Star, X } from "lucide-react";
import { fetchExploreItems } from "@/api/users/explore.api";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { ExploreItem } from "@/lib/explore";
import { toItineraryPlace } from "@/lib/explore";
import { cn } from "@/lib/utils";
import { AddToItineraryButton } from "../components/AddToItineraryButton";
import { useItineraries } from "../ItinerariesProvider";
import { MyPlanPanel } from "./MyPlanPanel";
import { PlannerMap } from "./PlannerMap";
import {
  DEFAULT_FILTERS,
  categoryOptions,
  filterListings,
  milesFromCentre,
  PLANNER_CHIPS,
  type PlannerFilters,
} from "./logic";
import { useActivePlan } from "./use-active-plan";

/** Stable empty list, so switching to My Plan doesn't rebuild markers every render. */
const NO_ITEMS: ExploreItem[] = [];

type Load =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; items: ExploreItem[]; partial: boolean };


const fieldClass =
  "h-9 rounded-xl border border-input bg-background px-3 text-sm text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * "Plan my trip": a full-screen planner over the site's own listings (the
 * same data as Explore). Chips and filters on the left, the map on the right;
 * "My Plan" edits the same itinerary or guest draft My Passport shows. Focus
 * trapping, Escape and scroll locking come from the Dialog.
 */
export function TripPlannerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 flex h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none p-0 ring-0 sm:max-w-none"
      >
        {open && <Planner />}
      </DialogContent>
    </Dialog>
  );
}

function Planner() {
  const { isAuthenticated } = useItineraries();
  const plan = useActivePlan();
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [filters, setFilters] = useState<PlannerFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tab, setTab] = useState<"places" | "plan">("places");
  const listRef = useRef<HTMLUListElement>(null);
  const fetchedFor = useRef<number | null>(null);

  // Listings load once per reload. Not cancelled on unmount, so Strict Mode's
  // second effect run doesn't skip the request.
  useEffect(() => {
    if (fetchedFor.current === reloadKey) return;
    fetchedFor.current = reloadKey;
    fetchExploreItems()
      .then(({ items, failed }) => setLoad({ status: "ready", items, partial: failed.length > 0 }))
      .catch(() => setLoad({ status: "error" }));
  }, [reloadKey]);

  const all = useMemo(() => (load.status === "ready" ? load.items : []), [load]);
  const results = useMemo(() => filterListings(all, filters), [all, filters]);
  const hasRatings = all.some((i) => i.rating !== null);
  const categories = useMemo(() => categoryOptions(all, filters.type), [all, filters.type]);

  // Plan stops as listings (for map coordinates), in visiting order.
  const stops = useMemo(() => {
    const byId = new Map(all.map((i) => [i.id, i]));
    return (plan.value?.items ?? []).map((item) => byId.get(item.place_id)).filter((i): i is ExploreItem => !!i);
  }, [all, plan.value]);

  const update = (patch: Partial<PlannerFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setSelectedId(null);
  };

  // Selecting from the map scrolls the list to that row.
  const select = (id: number) => {
    setSelectedId(id);
    requestAnimationFrame(() =>
      listRef.current?.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
    );
  };

  return (
    <>
      {/* Header: primary brand gradient; follows the light/dark theme */}
      <header className="relative isolate flex items-center gap-3 overflow-hidden bg-linear-to-br from-primary to-primary-soft px-4 py-3 text-primary-foreground sm:px-6 sm:py-4">
        {/* Decorative circles, kept faint so the text stays readable */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-10 -z-10 h-56 w-56 rounded-full bg-primary-foreground/6"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-40 -z-10 h-40 w-40 rounded-full border border-primary-foreground/10 max-[759px]:hidden"
        />

        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gold text-gold-foreground max-[759px]:h-9 max-[759px]:w-9"
        >
          <Plane className="h-5 w-5 -rotate-45" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-foreground ring-1 ring-primary-foreground/20">
            Passport
          </span>
          <DialogTitle className="mt-1 truncate font-display text-2xl leading-tight font-semibold text-primary-foreground max-[759px]:text-lg">
            Plan your passport
          </DialogTitle>
          <DialogDescription className="mt-0.5 truncate text-sm text-primary-foreground/80 max-[759px]:hidden">
            Marco Island · Add places and build your trip
          </DialogDescription>
        </div>
        <DialogClose
          aria-label="Close"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-foreground/10 text-primary-foreground ring-1 ring-primary-foreground/20 transition-colors hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          <X className="h-5 w-5" aria-hidden />
        </DialogClose>
      </header>

      {/* Category chips */}
      {/* <Chips value={filters.chip} onChange={(chip) => update({ chip })} /> */}

      <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[minmax(340px,440px)_1fr]">
        {/* Map: on top on phones, right column on desktop */}
        <div className="h-[34dvh] shrink-0 border-b border-border md:order-2 md:h-auto md:border-b-0">
          {/* My Plan shows only the plan's stops (A, B, C…); Places shows every result. */}
          <PlannerMap items={tab === "plan" ? NO_ITEMS : results} stops={stops} selectedId={selectedId} onSelect={select} />
        </div>

        {/* Left panel */}
        <section className="flex min-h-0 flex-1 flex-col md:order-1 md:border-r md:border-border" aria-label="Places and plan">
          <div role="tablist" aria-label="Planner view" className="flex border-b border-border px-4">
            {(["places", "plan"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  tab === t ? "border-gold text-primary" : "border-transparent text-muted-foreground hover:text-primary",
                )}
              >
                {t === "places" ? "Places" : `My Plan (${plan.value?.items.length ?? 0})`}
              </button>
            ))}
          </div>

          {tab === "plan" ? (
            <MyPlanPanel plan={plan} isAuthenticated={isAuthenticated} selectedId={selectedId} onSelect={select} />
          ) : (
            <>
              {/* Toolbar: search and filters */}
              <div className="space-y-2.5 border-b border-border px-4 py-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    aria-label="Search places"
                    placeholder="Search places, food, beaches…"
                    value={filters.query}
                    onChange={(e) => update({ query: e.target.value })}
                    className="h-9 rounded-xl pl-9 text-sm"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Listing type"
                    value={filters.type}
                    // A category from the other type would match nothing, so reset it.
                    onChange={(e) => update({ type: e.target.value as PlannerFilters["type"], categories: [] })}
                    className={fieldClass}
                  >
                    <option value="all">All types</option>
                    <option value="place">Places to visit</option>
                    <option value="business">Businesses</option>
                  </select>
                  <CategoryMenu
                    options={categories}
                    selected={filters.categories}
                    onChange={(categories) => update({ categories })}
                  />
                  {hasRatings && (
                    <select
                      aria-label="Minimum rating"
                      value={filters.minRating}
                      onChange={(e) => update({ minRating: Number(e.target.value) })}
                      className={fieldClass}
                    >
                      <option value={0}>Any rating</option>
                      <option value={4}>4+ stars</option>
                      <option value={4.5}>4.5+ stars</option>
                    </select>
                  )}
                  <label className="flex items-center gap-2 text-xs font-medium text-primary">
                    <Switch checked={filters.featuredOnly} onCheckedChange={(featuredOnly) => update({ featuredOnly })} />
                    Featured
                  </label>
                </div>
              </div>

              <Results
                load={load}
                results={results}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onRetry={() => {
                  setLoad({ status: "loading" });
                  setReloadKey((k) => k + 1);
                }}
                onReset={() => update(DEFAULT_FILTERS)}
                listRef={listRef}
              />
            </>
          )}
        </section>
      </div>
    </>
  );
}

/** Category chips: a toolbar where arrow keys move between chips. */
type CategoryOptionItem = ReturnType<typeof categoryOptions>[number];

/** Multi-select categories with counts, grouped like the Explore filters. */
function CategoryMenu({
  options,
  selected,
  onChange,
}: {
  options: CategoryOptionItem[];
  selected: string[];
  onChange: (keys: string[]) => void;
}) {
  const toggle = (key: string) =>
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
  const label =
    selected.length === 0
      ? "All categories"
      : selected.length === 1
        ? (options.find((o) => o.key === selected[0])?.name ?? "1 category")
        : `${selected.length} categories`;
  const groups = (["place", "business"] as const)
    .map((type) => ({ type, items: options.filter((o) => o.type === type) }))
    .filter((g) => g.items.length > 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Categories"
        className={cn(fieldClass, "inline-flex items-center gap-1.5", selected.length > 0 && "border-primary")}
      >
        <span className="max-w-40 truncate">{label}</span>
        <ChevronDown className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 w-64 overflow-y-auto">
        {groups.length === 0 && <div className="px-2.5 py-2 text-sm text-muted-foreground">No categories</div>}
        {groups.map((g, gi) => (
          <div key={g.type}>
            {gi > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{g.type === "place" ? "Places to visit" : "Businesses"}</DropdownMenuLabel>
            {g.items.map((o) => (
              <DropdownMenuItem key={o.key} closeOnClick={false} onClick={() => toggle(o.key)}>
                <Checkbox checked={selected.includes(o.key)} tabIndex={-1} className="pointer-events-none" />
                <span className="flex-1 truncate">{o.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{o.count}</span>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onChange([])} className="justify-center text-xs font-medium">
              Clear categories
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Chips({ value, onChange }: { value: PlannerFilters["chip"]; onChange: (chip: PlannerFilters["chip"]) => void }) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const buttons = [...e.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : (index + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    e.preventDefault();
    buttons[next]?.focus();
  };

  return (
    <div
      role="toolbar"
      aria-label="Categories"
      onKeyDown={onKeyDown}
      className="flex gap-2 overflow-x-auto border-b border-border px-4 py-2.5 sm:px-6"
    >
      {PLANNER_CHIPS.map((chip) => {
        const active = chip.id === value;
        return (
          <button
            key={chip.id}
            type="button"
            aria-pressed={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(chip.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-primary hover:border-primary/50",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

function Results({
  load,
  results,
  selectedId,
  onSelect,
  onRetry,
  onReset,
  listRef,
}: {
  load: Load;
  results: ExploreItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onRetry: () => void;
  onReset: () => void;
  listRef: React.RefObject<HTMLUListElement | null>;
}) {
  if (load.status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading places…
      </div>
    );
  }
  if (load.status === "error") {
    return (
      <div className="m-4 rounded-2xl bg-muted p-4 text-sm text-muted-foreground" role="alert">
        We couldn&apos;t load places right now.
        <Button variant="outline" size="sm" className="mt-3 flex" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </Button>
      </div>
    );
  }
  if (results.length === 0) {
    return (
      <div className="m-4 rounded-2xl bg-muted p-4 text-sm text-muted-foreground" role="status">
        Nothing matches these filters yet.
        <Button variant="outline" size="sm" className="mt-3 flex" onClick={onReset}>
          Clear filters
        </Button>
      </div>
    );
  }

  // Up/Down arrows move between rows.
  const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const rows = [...e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-row]")];
    const index = rows.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    e.preventDefault();
    rows[Math.max(0, Math.min(rows.length - 1, index + (e.key === "ArrowDown" ? 1 : -1)))]?.focus();
  };

  return (
    <>
      <p className="px-4 pt-3 text-xs text-muted-foreground" role="status">
        {results.length} {results.length === 1 ? "place" : "places"}
        {load.partial && " · some listings couldn't be loaded"}
      </p>
      <ul ref={listRef} onKeyDown={onKeyDown} className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3" aria-label="Places">
        {results.map((item) => (
          <PlaceRow key={item.id} item={item} selected={item.id === selectedId} onSelect={() => onSelect(item.id)} />
        ))}
      </ul>
    </>
  );
}

function PlaceRow({ item, selected, onSelect }: { item: ExploreItem; selected: boolean; onSelect: () => void }) {
  const miles = milesFromCentre(item);
  return (
    <li
      data-id={item.id}
      className={cn(
        "flex gap-3 rounded-2xl border p-2.5 transition-colors",
        selected ? "border-gold bg-gold/10" : "border-transparent hover:bg-muted/60",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <button
          type="button"
          data-row
          onClick={onSelect}
          aria-pressed={selected}
          aria-label={`${item.name}. Show on map`}
          className="block w-full truncate text-left font-display font-semibold text-primary hover:underline focus-visible:underline focus-visible:outline-none"
        >
          {item.name}
        </button>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          {item.rating !== null ? (
            <>
              <Star className="h-3 w-3 fill-gold text-gold" aria-hidden />
              <span className="font-semibold text-primary">{item.rating.toFixed(1)}</span>
              <span>({item.reviewCount} {item.reviewCount === 1 ? "review" : "reviews"})</span>
            </>
          ) : (
            <span>No reviews yet</span>
          )}
          <span aria-hidden>·</span>
          <span className="truncate">{item.category}</span>
        </p>
        {(item.address || miles !== null) && (
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{item.address ?? item.location}</span>
            {miles !== null && <span className="shrink-0">· {miles.toFixed(1)} mi</span>}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <AddToItineraryButton place={toItineraryPlace(item)} size="sm" compactLabel />
          <Link href={item.href} className="text-xs font-medium text-primary underline-offset-4 hover:underline">
            Details
          </Link>
        </div>
      </div>
    </li>
  );
}
