"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { List, Map as MapIcon, Play } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GROUP_TYPES } from "@/data/trip-planner";
import { UNSCHEDULED, formatTravelers, fromDayKey, tripDayKeys } from "@/lib/trip-planner/trip-utils";
import { cn } from "@/lib/utils";
import type { Trip } from "@/types/trip";
import { MapView, type MapPoint, type RouteStatus } from "../map/MapView";
import type { EntryPatch, TripDashboardController } from "./controller";
import { DayChips, type DayFilter } from "./DayChips";
import { ItineraryDay } from "./ItineraryDay";
import { TripHeroCard } from "./TripHeroCard";

interface TripDashboardProps {
  trip: Trip;
  /** Shared trips are view-only until saved */
  readOnly?: boolean;
  /** Data lookups and actions from the hosting page (/plan or My Trips) */
  controller: TripDashboardController;
}

/** Google Maps directions through the given stops, starting from the visitor's location. */
function directionsUrl(points: MapPoint[]) {
  if (points.length === 0) return null;
  const coord = (p: MapPoint) => `${p.lat},${p.lng}`;
  const params = new URLSearchParams({
    api: "1",
    destination: coord(points[points.length - 1]),
    travelmode: "driving",
  });
  if (points.length > 1) params.set("waypoints", points.slice(0, -1).map(coord).join("|"));
  return `https://www.google.com/maps/dir/?${params}`;
}

export function TripDashboard({ trip, readOnly, controller }: TripDashboardProps) {
  const { getItem } = controller;
  const days = useMemo(() => tripDayKeys(trip), [trip]);
  const unscheduled = trip.days[UNSCHEDULED] ?? [];

  // The host can own the day selection (the planner does); otherwise keep it here
  const [ownDay, setOwnDay] = useState<string | null>(null);
  const rawDay = controller.setSelectedDay ? controller.selectedDay : ownDay;
  const selectedDay =
    rawDay && (days.includes(rawDay) || (rawDay === UNSCHEDULED && unscheduled.length > 0)) ? rawDay : days[0];
  const selectDay = controller.setSelectedDay ?? setOwnDay;
  const [routeStatus, setRouteStatus] = useState<RouteStatus>({ state: "idle" });

  const [filter, setFilter] = useState<DayFilter>("all");
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mobileTab, setMobileTab] = useState<"list" | "map">("list");

  const dayEntries = trip.days[selectedDay];
  const points = useMemo<MapPoint[]>(
    () =>
      (dayEntries ?? []).flatMap((entry, i) => {
        const item = getItem(entry.itemId);
        return item && item.lat !== null && item.lng !== null
          ? [{ id: entry.id, lat: item.lat, lng: item.lng, title: item.name, label: String(i + 1) }]
          : [];
      }),
    [dayEntries, getItem],
  );

  const totalStops = Object.values(trip.days).reduce((n, e) => n + e.length, 0);
  const firstStop = Object.values(trip.days).flat()[0];
  const coverImage = firstStop && getItem(firstStop.itemId)?.image;
  const navigateUrl = directionsUrl(points);
  const selectedLabel =
    selectedDay === UNSCHEDULED ? "Unscheduled" : format(fromDayKey(selectedDay), "MM/dd");

  const scrollToStop = (entryId: string) => {
    requestAnimationFrame(() =>
      document
        .getElementById(`stop-${entryId}`)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
    );
  };

  const focusEntry = (day: string, entryId: string) => {
    selectDay(day);
    setActiveEntryId(entryId);
  };

  const selectStopOnMap = (entryId: string) => {
    setActiveEntryId(entryId);
    if (filter !== "all" && filter !== selectedDay) setFilter(selectedDay);
    setMobileTab("list");
    scrollToStop(entryId);
  };

  const changeFilter = (value: DayFilter) => {
    setFilter(value);
    if (value !== "all") selectDay(value);
  };

  const dayProps = (day: string) => ({
    readOnly,
    activeEntryId,
    selected: day === selectedDay,
    onSelectDay: () => selectDay(day),
    onFocusEntry: (entryId: string) => focusEntry(day, entryId),
    getItem,
    onMove: controller.onMoveEntry && ((from: number, to: number) => controller.onMoveEntry?.(day, from, to)),
    onRemove: controller.onRemoveEntry && ((entryId: string) => controller.onRemoveEntry?.(day, entryId)),
    onUpdate:
      controller.onUpdateEntry &&
      ((entryId: string, patch: EntryPatch) => controller.onUpdateEntry?.(day, entryId, patch)),
  });

  const groupLabel = GROUP_TYPES.find((g) => g.id === trip.groupType)?.label;

  return (
    <div data-trip-print className="flex min-h-0 flex-1 flex-col md:flex-row print:block">
      {/* Mobile list/map switch */}
      <div
        role="tablist"
        aria-label="My Plan view"
        className="flex gap-1 border-b border-border bg-card p-2 md:hidden print:hidden"
      >
        {(
          [
            ["list", "Itinerary", List],
            ["map", "Map", MapIcon],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`plan-tab-${id}`}
            aria-selected={mobileTab === id}
            aria-controls={`plan-panel-${id}`}
            onClick={() => setMobileTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50",
              mobileTab === id ? "bg-brand-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {/* Itinerary panel */}
      <section
        id="plan-panel-list"
        aria-labelledby="my-plan-heading"
        className={cn(
          "min-h-0 flex-1 flex-col overflow-y-auto border-border bg-card md:flex md:w-100 md:flex-none md:border-r xl:w-[30%]",
          "print:block print:w-full print:overflow-visible print:border-none",
          mobileTab === "list" ? "flex" : "hidden",
        )}
      >
        <div className="space-y-4 p-4">
          <TripHeroCard
            trip={trip}
            coverImage={coverImage}
            readOnly={readOnly}
            onEdit={controller.onEdit}
            onShare={controller.onShare}
            onPrint={() => window.print()}
            onNewTrip={controller.onNewTrip}
            onDelete={controller.onDelete && (() => setConfirmDelete(true))}
          />

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id="my-plan-heading" className="text-xl font-bold text-foreground">
                My Plan
              </h2>
              {controller.showTravelers && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatTravelers(trip.travelers)}
                  {groupLabel && ` · ${groupLabel}`}
                </p>
              )}
              {!readOnly && controller.onSwitchTrip && controller.trips && controller.trips.length > 1 && (
                <div className="mt-2 print:hidden">
                  <label htmlFor="trip-switcher" className="sr-only">
                    Switch trip
                  </label>
                  <select
                    id="trip-switcher"
                    value={trip.id}
                    onChange={(e) => controller.onSwitchTrip?.(e.target.value)}
                    className="h-8 max-w-full rounded-full border border-border bg-card px-3 text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50"
                  >
                    {controller.trips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <p
              className="shrink-0 text-center leading-none"
              aria-label={`${totalStops} ${totalStops === 1 ? "stop" : "stops"}`}
            >
              <span className="block text-3xl font-bold text-foreground">{totalStops}</span>
              <span className="text-xs text-muted-foreground">{totalStops === 1 ? "stop" : "stops"}</span>
            </p>
          </div>

          {navigateUrl ? (
            <a
              href={navigateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-muted text-sm font-semibold text-foreground shadow-soft transition-colors hover:bg-brand-primary-tint outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50 print:hidden"
            >
              <Play className="size-4 fill-current" aria-hidden />
              Navigate {selectedLabel}
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          ) : (
            <p className="flex h-11 items-center justify-center gap-2 rounded-xl bg-muted text-sm text-muted-foreground print:hidden">
              <Play className="size-4" aria-hidden />
              Add stops to {selectedLabel} to navigate
            </p>
          )}

          <DayChips
            days={days}
            value={filter}
            onChange={changeFilter}
            extra={unscheduled.length > 0 ? [{ id: UNSCHEDULED, label: "Unscheduled" }] : undefined}
          />

          {!readOnly && controller.showGuestNotice && (
            <p className="text-[11px] leading-4 text-muted-foreground print:hidden">
              Planning as a guest, so this trip is saved in this browser only.{" "}
              <Link href="/auth" className="font-medium text-brand-primary underline-offset-2 hover:underline">
                Sign in
              </Link>{" "}
              to keep multiple trips.
            </p>
          )}
        </div>

        {/* Extra bottom space on phones so the floating badge never hides the last stop */}
        <div className="divide-y divide-border px-4 pb-28 md:pb-6">
          <h2 className="sr-only">Itinerary</h2>
          {days.map((day) => (
            <ItineraryDay
              key={day}
              day={day}
              title={format(fromDayKey(day), "MM/dd")}
              subtitle={format(fromDayKey(day), "EEEE")}
              entries={trip.days[day] ?? []}
              emptyText={readOnly ? "Nothing planned." : "Nothing planned yet."}
              hiddenOnScreen={filter !== "all" && filter !== day}
              onAddStop={
                controller.onAddStop &&
                (() => {
                  selectDay(day);
                  controller.onAddStop?.(day);
                })
              }
              {...dayProps(day)}
            />
          ))}

          <ItineraryDay
            day={UNSCHEDULED}
            title="Unscheduled Stops"
            entries={unscheduled}
            emptyText="Places you save without a day will show up here."
            hiddenOnScreen={filter !== "all" && filter !== UNSCHEDULED}
            onAddStop={
              controller.onAddStop &&
              (() => {
                selectDay(UNSCHEDULED);
                controller.onAddStop?.(UNSCHEDULED);
              })
            }
            renderSchedule={
              readOnly || !controller.onMoveEntryToDay
                ? undefined
                : (entry) => (
                    <label className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground print:hidden">
                      <span>Schedule for</span>
                      <select
                        value=""
                        onChange={(e) =>
                          e.target.value && controller.onMoveEntryToDay?.(UNSCHEDULED, entry.id, e.target.value)
                        }
                        className="h-7 rounded-full border border-border bg-card px-2 text-xs font-medium text-foreground outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50"
                      >
                        <option value="">Pick a day…</option>
                        {days.map((d, i) => (
                          <option key={d} value={d}>
                            Day {i + 1} · {format(fromDayKey(d), "EEE MM/dd")}
                          </option>
                        ))}
                      </select>
                    </label>
                  )
            }
            {...dayProps(UNSCHEDULED)}
          />

          {!readOnly && selectedDay !== UNSCHEDULED && controller.renderSelectedDayExtras && (
            <div className="pt-5">{controller.renderSelectedDayExtras(selectedDay)}</div>
          )}
        </div>
      </section>

      {/* Map: full height, rounded on the edge facing the list */}
      <section
        id="plan-panel-map"
        aria-label={`Map for ${selectedLabel}`}
        className={cn(
          "relative min-h-0 flex-1 md:block md:pl-3 print:hidden",
          mobileTab === "map" ? "block" : "hidden",
        )}
      >
        <div className="relative h-full overflow-hidden bg-muted md:rounded-l-xl md:shadow-soft">
          <MapView
            className="h-full"
            label={`Map of stops for ${selectedLabel}`}
            points={points}
            activeId={activeEntryId}
            onSelect={selectStopOnMap}
            showRoute={!controller.routeMode}
            travelMode={controller.routeMode}
            onRouteStatus={setRouteStatus}
          />
          <p className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-card/95 px-3 py-1 text-xs font-medium text-foreground shadow-soft">
            {selectedLabel} · {points.length} {points.length === 1 ? "stop" : "stops"}
          </p>
          {controller.routeMode && points.length > 1 && routeStatus.state === "error" && (
            <p className="absolute inset-x-3 bottom-3 rounded-lg bg-card/95 px-3 py-2 text-xs text-foreground shadow-soft md:right-auto md:max-w-sm">
              {routeStatus.message} Use Navigate to open directions in Google Maps.
            </p>
          )}
        </div>
      </section>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{trip.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the trip and everything planned in it. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep trip</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                setConfirmDelete(false);
                if ((await controller.onDelete?.()) !== false) toast.success("Trip deleted");
              }}
            >
              Delete trip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
