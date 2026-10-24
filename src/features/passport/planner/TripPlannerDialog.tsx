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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { STORAGE_KEYS, siteStorage } from "@/lib/consent";
import type { ExploreItem } from "@/lib/explore";
import { toPassportPlace } from "@/lib/explore";
import { cn } from "@/lib/utils";
import { AddToPassportButton } from "../components/AddToPassportButton";
import { usePassports } from "../PassportsProvider";
import { MyPlanPanel } from "./MyPlanPanel";
import { PlannerMap } from "./PlannerMap";
import {
  DEFAULT_FILTERS,
  categoryOptions,
  filterPlaces,
  milesFromCentre,
  type PlannerFilters,
} from "./logic";
import { useActivePlan } from "./use-active-plan";

/** Stable empty list, so switching to My Plan doesn't rebuild markers every render. */
const NO_ITEMS: ExploreItem[] = [];

type Load =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; items: ExploreItem[]; partial: boolean };


const PANEL_MIN = 300;
const PANEL_MAX = 720;
const PANEL_DEFAULT = 400;
const PANEL_KEY = STORAGE_KEYS.plannerWidth;
const clampWidth = (w: number) =>
  Math.round(Math.min(Math.max(w, PANEL_MIN), Math.min(PANEL_MAX, window.innerWidth - 320)));

/** Width of the left panel on desktop, resizable by dragging or arrow keys, remembered per browser. */
function usePanelWidth() {
  // The planner only renders once opened on the client, so storage can be read up front.
  const [width, setWidth] = useState(() => {
    const saved = Number(siteStorage()?.getItem(PANEL_KEY));
    return saved ? clampWidth(saved) : PANEL_DEFAULT;
  });
  const commit = (w: number) => {
    const next = clampWidth(w);
    setWidth(next);
    try {
      siteStorage()?.setItem(PANEL_KEY, String(next));
    } catch {}
  };
  return [width, setWidth, commit] as const;
}

const fieldClass =
  "h-9 rounded-full border border-border bg-background px-2.5 text-xs font-medium text-primary shadow-soft outline-none transition-colors hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * "Plan my trip": a full-screen planner over the site's own places (the
 * same data as Explore). Chips and filters on the left, the map on the right;
 * "My Plan" edits the same passport or guest draft My Passport shows. Focus
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
  const { isAuthenticated } = usePassports();
  const plan = useActivePlan();
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [filters, setFilters] = useState<PlannerFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tab, setTab] = useState<"places" | "plan">("places");
  const listRef = useRef<HTMLUListElement>(null);
  const [panelWidth, setPanelWidth, commitPanelWidth] = usePanelWidth();
  const [resizing, setResizing] = useState(false);

  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = panelWidth;
    let last = startW;
    setResizing(true);
    const move = (ev: PointerEvent) => {
      last = clampWidth(startW + ev.clientX - startX);
      setPanelWidth(last);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setResizing(false);
      commitPanelWidth(last);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onResizeKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 64 : 16;
    if (e.key === "ArrowLeft") commitPanelWidth(panelWidth - step);
    else if (e.key === "ArrowRight") commitPanelWidth(panelWidth + step);
    else if (e.key === "Home") commitPanelWidth(PANEL_MIN);
    else if (e.key === "End") commitPanelWidth(PANEL_MAX);
    else return;
    e.preventDefault();
  };
  const fetchedFor = useRef<number | null>(null);

  // Places load once per reload. Not cancelled on unmount, so Strict Mode's
  // second effect run doesn't skip the request.
  useEffect(() => {
    if (fetchedFor.current === reloadKey) return;
    fetchedFor.current = reloadKey;
    fetchExploreItems()
      .then(({ items, partial }) => setLoad({ status: "ready", items, partial }))
      .catch(() => setLoad({ status: "error" }));
  }, [reloadKey]);

  const all = useMemo(() => (load.status === "ready" ? load.items : []), [load]);
  const results = useMemo(() => filterPlaces(all, filters), [all, filters]);
  const categories = useMemo(() => categoryOptions(all), [all]);

  // Plan stops as Explore items (for map coordinates), in visiting order.
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
      {/* Header: solid navy with gold accents; follows the light/dark theme */}
      <header className="relative isolate flex shrink-0 items-center gap-3 overflow-hidden border-b border-gold/30 bg-primary px-4 py-3 text-primary-foreground sm:gap-4 sm:px-6">
        {/* Thin gold accent along the top edge */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gold" />
        {/* Decorative circles, kept faint so the text stays readable */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-12 -z-10 h-64 w-64 rounded-full bg-primary-foreground/3"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-48 -z-10 h-40 w-40 rounded-full border border-primary-foreground/6 max-[759px]:hidden"
        />

        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-tile bg-gold text-gold-foreground sm:h-10 sm:w-10"
        >
          <Plane className="h-5 w-5 -rotate-45" />
        </span>
        {/* Kept compact so the list below gets the height */}
        <div className="min-w-0 flex-1">
          <DialogTitle className="truncate font-display text-lg leading-tight font-medium text-primary-foreground sm:text-xl">
            Plan your passport
          </DialogTitle>
          <DialogDescription className="mt-0.5 truncate text-xs text-primary-foreground/75 max-[759px]:hidden">
            Marco Island · Add places and build your trip
          </DialogDescription>
        </div>
        <DialogClose
          aria-label="Close"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-foreground/10 text-primary-foreground ring-1 ring-primary-foreground/20 transition-colors hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          <X className="h-5 w-5" aria-hidden />
        </DialogClose>
      </header>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pt-3 md:grid md:overflow-hidden md:grid-cols-[var(--panel-w)_1fr] md:pt-4",
          resizing && "cursor-col-resize select-none [&_*]:pointer-events-none",
        )}
        style={{ "--panel-w": `${panelWidth}px` } as React.CSSProperties}
      >
        {/* Map: on top on phones, right column on desktop */}
        <div className="mx-4 mb-3 h-[40dvh] min-h-56 min-w-0 shrink-0 overflow-hidden rounded-tile border border-border md:order-2 md:mb-4 md:h-auto md:min-h-0">
          {/* My Plan shows only the plan's stops (A, B, C…); Places shows every result. */}
          <PlannerMap items={tab === "plan" ? NO_ITEMS : results} stops={stops} selectedId={selectedId} onSelect={select} />
        </div>

        {/* Left panel */}
        <section
          className="relative flex shrink-0 flex-col md:order-1 md:min-h-0 md:flex-1 md:shrink md:border-r md:border-border"
          aria-label="Places and plan"
        >
          {/* Drag handle on the panel's right edge (desktop only) */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panel"
            aria-valuenow={panelWidth}
            aria-valuemin={PANEL_MIN}
            aria-valuemax={PANEL_MAX}
            tabIndex={0}
            onPointerDown={startResize}
            onKeyDown={onResizeKey}
            onDoubleClick={() => commitPanelWidth(PANEL_DEFAULT)}
            className="group/handle absolute top-0 -right-1.5 z-20 hidden h-full w-3 cursor-col-resize touch-none focus-visible:outline-none md:block"
          >
            <span
              className={cn(
                "absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 transition-colors group-hover/handle:bg-gold group-focus-visible/handle:bg-gold",
                resizing && "bg-gold",
              )}
            />
            <span className="absolute top-1/2 left-1/2 h-10 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border shadow-soft transition-colors group-hover/handle:bg-gold group-focus-visible/handle:bg-gold" />
          </div>
          <div role="tablist" aria-label="Planner view" className="mx-4 mb-3 flex rounded-full bg-muted p-1">
            {(["places", "plan"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  tab === t ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-primary",
                )}
              >
                {t === "places" ? (
                  "Places"
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    My Plan
                    <span
                      className={cn(
                        "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-caption tabular-nums",
                        tab === t ? "bg-gold text-gold-foreground" : "bg-background text-primary",
                      )}
                    >
                      {plan.value?.items.length ?? 0}
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {tab === "plan" ? (
            <MyPlanPanel plan={plan} isAuthenticated={isAuthenticated} selectedId={selectedId} onSelect={select} />
          ) : (
            <>
              {/* Toolbar: search and categories */}
              <div className="flex items-center gap-2 border-y border-border bg-muted/30 px-4 py-3">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    aria-label="Search places"
                    placeholder="Search places, food…"
                    value={filters.query}
                    onChange={(e) => update({ query: e.target.value })}
                    className="h-9 rounded-full bg-background pl-9 text-sm shadow-soft"
                  />
                </div>
                <CategoryMenu
                  options={categories}
                  selected={filters.categories}
                  onChange={(categories) => update({ categories })}
                />
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

type CategoryOptionItem = ReturnType<typeof categoryOptions>[number];

/** Multi-select categories with counts, the same ones as Explore's chips. */
function CategoryMenu({
  options,
  selected,
  onChange,
}: {
  options: CategoryOptionItem[];
  selected: string[];
  onChange: (slugs: string[]) => void;
}) {
  const toggle = (slug: string) =>
    onChange(selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]);
  const label =
    selected.length === 0
      ? "All categories"
      : selected.length === 1
        ? (options.find((o) => o.slug === selected[0])?.name ?? "1 category")
        : `${selected.length} categories`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Categories"
        className={cn(fieldClass, "inline-flex shrink-0 items-center gap-1.5", selected.length > 0 && "border-primary")}
      >
        <span className="max-w-40 truncate">{label}</span>
        <ChevronDown className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-64 overflow-y-auto">
        {options.length === 0 && <div className="px-2.5 py-2 text-sm text-muted-foreground">No categories</div>}
        {options.map((o) => (
          <DropdownMenuItem key={o.slug} closeOnClick={false} onClick={() => toggle(o.slug)}>
            <Checkbox checked={selected.includes(o.slug)} tabIndex={-1} className="pointer-events-none" />
            <span className="flex-1 truncate">{o.name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{o.count}</span>
          </DropdownMenuItem>
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
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-muted-foreground" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
        </span>
        Loading places…
      </div>
    );
  }
  if (load.status === "error") {
    return (
      <div className="m-4 rounded-tile border border-dashed border-border bg-muted/50 p-5 text-center text-sm text-muted-foreground [&>button]:mx-auto" role="alert">
        We couldn&apos;t load places right now.
        <Button variant="outline" size="sm" className="mt-3 flex" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </Button>
      </div>
    );
  }
  if (results.length === 0) {
    return (
      <div className="m-4 rounded-tile border border-dashed border-border bg-muted/50 p-5 text-center text-sm text-muted-foreground [&>button]:mx-auto" role="status">
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
      <p className="eyebrow px-4 pt-2.5 pb-2 text-muted-foreground" role="status">
        <span className="text-primary">{results.length}</span> {results.length === 1 ? "place" : "places"}
        {load.partial && " · some places couldn't be loaded"}
      </p>
      <ul ref={listRef} onKeyDown={onKeyDown} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4" aria-label="Places">
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
        "group flex items-center gap-3 rounded-tile border bg-card p-2.5 shadow-soft transition-all",
        selected
          ? "border-gold bg-gold/10 ring-1 ring-gold/40"
          : "border-border/60 hover:-translate-y-px hover:border-primary/30 hover:shadow-elegant",
      )}
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-tile bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
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
        <p className="mt-0.5 flex items-center gap-1 overflow-hidden whitespace-nowrap text-xs text-muted-foreground">
          {item.rating !== null ? (
            <>
              <Star className="h-3 w-3 fill-gold text-gold" aria-hidden />
              <span className="font-semibold text-primary">{item.rating.toFixed(1)}</span>
              <span>({item.reviewCount} {item.reviewCount === 1 ? "review" : "reviews"})</span>
            </>
          ) : (
            <span>No reviews yet</span>
          )}
          {item.category && (
            <>
              <span aria-hidden>·</span>
              <span className="truncate">{item.category}</span>
            </>
          )}
        </p>
        {(item.address || miles !== null) && (
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{item.address || item.location}</span>
            {miles !== null && <span className="shrink-0">· {miles.toFixed(1)} mi</span>}
          </p>
        )}
      </div>
      {/* Actions sit beside the text rather than under it, keeping rows short */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <AddToPassportButton place={toPassportPlace(item)} size="sm" compactLabel className="h-8 px-3" />
        <Link href={item.href} className="rounded-full px-2 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10">
          Details
        </Link>
      </div>
    </li>
  );
}
