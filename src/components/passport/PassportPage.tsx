"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, KeyRound, LogOut, Map as MapIcon, RotateCw, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { HeroBackground } from "@/components/site/HeroBackground";
import { fetchAllItems, type ItemsResult } from "@/features/trips/services/items-service";
import { AddToTripButton } from "@/features/trips/components/AddToTripButton";
import { ItemDetailSheet } from "@/features/trips/components/ItemDetailSheet";
import { PlaceCard } from "@/features/trips/components/PlaceCard";
import type { ItemSource, NormalizedItem } from "@/features/trips/types";

type Filter = "all" | ItemSource;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "places", label: "Places" },
  { value: "business", label: "Businesses" },
];

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | ({ status: "ready" } & ItemsResult);

/** `?highlight=places:12` — set by "View on Passport" from My Trips */
function readHighlight() {
  return new URLSearchParams(window.location.search).get("highlight");
}

export function PassportPage() {
  const router = useRouter();
  // /copypassport shows the Visit Widget map; /passport keeps its offcanvas
  const isCopyPassport = usePathname() === "/copypassport";
  const { isAuthenticated, ready, user, logout, loggingOut } = useAuth();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<NormalizedItem | null>(null);
  const [visitWidgetItem, setVisitWidgetItem] = useState<NormalizedItem | null>(null);

  const openPassportSheet = (item: NormalizedItem) => setSelected(item);
  const openVisitWidget = (item: NormalizedItem) => setVisitWidgetItem(item);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [ready, isAuthenticated, router]);

  const fetchItems = useCallback(() => {
    fetchAllItems()
      .then((result) => {
        setState({ status: "ready", ...result });
        // Scroll to and open the item requested via ?highlight=
        const id = readHighlight();
        const item = id && result.items.find((i) => i.id === id);
        if (!item) return;
        setFilter("all");
        setQuery("");
        setHighlightId(item.id);
        setSelected(item);
        requestAnimationFrame(() =>
          document.getElementById(`item-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }),
        );
      })
      .catch(() => setState({ status: "error" }));
  }, []);

  const load = () => {
    setState({ status: "loading" });
    fetchItems();
  };

  useEffect(() => {
    if (ready && isAuthenticated) fetchItems();
  }, [ready, isAuthenticated, fetchItems]);

  const visible = useMemo(() => {
    if (state.status !== "ready") return [];
    const q = query.trim().toLowerCase();
    return state.items.filter(
      (i) =>
        (filter === "all" || i.source === filter) &&
        (!q || `${i.name} ${i.category} ${i.address}`.toLowerCase().includes(q)),
    );
  }, [state, filter, query]);

  if (!ready || !isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-viewport">
        <HeroBackground src="/assets/place-sunset.jpg" alt="Sunset over a Marco Island pier" />
        <div className="hero-container flex-col items-stretch justify-center gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-5 sm:text-[11px]">
              <span className="h-px w-8 bg-gold/70" />
              <Sparkles className="h-3.5 w-3.5" /> Your itinerary
            </div>
            <h1 className="font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
              My <span className="italic text-gold">Passport</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
              Browse places and local businesses across Marco Island and add the
              ones you love to your trips.
            </p>
            <p className="mt-4 text-sm text-primary-foreground/60">
              Signed in as{" "}
              <span className="font-medium text-gold">{user?.name || user?.email}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/my-trips">
              <Button variant="gold" size="lg">
                <MapIcon className="h-4 w-4" /> My Trips
              </Button>
            </Link>
            <Link href="/change-password">
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <KeyRound className="h-4 w-4" /> Change Password
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => logout()}
              disabled={loggingOut}
              className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              <LogOut className="h-4 w-4" /> {loggingOut ? "Signing out…" : "Sign Out"}
            </Button>
          </div>
        </div>
      </section>

      {/* Places + businesses */}
      <section className="bg-background py-12 md:py-16">
        <div className="site-container">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div role="tablist" aria-label="Filter by type" className="inline-flex rounded-full bg-muted p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    filter === f.value ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or area"
                aria-label="Search places and businesses"
                className="rounded-full pl-9"
              />
            </div>
          </div>

          {state.status === "ready" && state.failed.length > 0 && (
            <p className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {state.failed[0] === "places" ? "Places" : "Businesses"} couldn&apos;t be loaded right now.
              <button type="button" onClick={load} className="font-medium underline">Retry</button>
            </p>
          )}

          {state.status === "loading" && (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
              {Array.from({ length: 6 }, (_, i) => (
                <li key={i} className="overflow-hidden rounded-2xl border border-border">
                  <Skeleton className="h-40 rounded-none" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="mt-3 h-9 w-32 rounded-full" />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {state.status === "error" && (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
              <p className="mt-3 font-semibold text-[#002E50]">We couldn&apos;t load places and businesses.</p>
              <Button variant="outline" className="mt-5" onClick={load}>
                <RotateCw className="h-4 w-4" /> Try again
              </Button>
            </div>
          )}

          {state.status === "ready" &&
            (visible.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-border p-10 text-center text-muted-foreground">
                {state.items.length === 0
                  ? "There are no places or businesses to show yet."
                  : "Nothing matches your filters."}
              </div>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((item) => (
                  <PlaceCard
                    key={item.id}
                    item={item}
                    highlighted={item.id === highlightId}
                    onSelect={isCopyPassport ? openVisitWidget : openPassportSheet}
                    actions={<AddToTripButton item={item} size="sm" />}
                  />
                ))}
              </ul>
            ))}
        </div>
      </section>

     
        <ItemDetailSheet item={selected} onClose={() => setSelected(null)} />
     
    </>
  );
}
