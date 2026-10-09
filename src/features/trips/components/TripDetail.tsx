"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { TripDashboardController } from "@/components/trip-planner/dashboard/controller";
import { TripDashboard } from "@/components/trip-planner/dashboard/TripDashboard";
import { dayNumberFromKey, toDashboardItems, toDashboardTrip } from "../dashboard-adapter";
import { tripLocation } from "../trip-logic";
import { useTrips } from "../TripsProvider";
import { CreateTripDialog } from "./CreateTripDialog";

/** Fills the viewport under the fixed site header, like the /plan planner */
const shell = "flex h-dvh flex-col bg-brand-page pt-20 print:h-auto print:pt-0";

export function TripDetail({ tripId }: { tripId: string }) {
  const router = useRouter();
  const { trips, getTrip, loading, updateTrip, deleteTrip, removeItem, assignItemToDay, openCreateTrip } = useTrips();
  const trip = getTrip(tripId);
  const [editing, setEditing] = useState(false);

  const dashboardTrip = useMemo(() => trip && toDashboardTrip(trip), [trip]);
  const items = useMemo(() => (trip ? toDashboardItems(trip) : new Map()), [trip]);

  const controller = useMemo<TripDashboardController | null>(() => {
    if (!trip) return null;
    return {
      // No routeMode: stops are joined with the same arrow line as /plan
      getItem: (itemId) => items.get(itemId),
      trips: trips.map((t) => ({ id: t.id, name: t.name })),
      onSwitchTrip: (id) => router.push(`/my-trips/${id}`),
      onEdit: () => setEditing(true),
      onNewTrip: () => openCreateTrip(),
      onDelete: async () => {
        const deleted = await deleteTrip(trip.id);
        if (deleted) router.push("/my-trips");
        return deleted;
      },
      // Stops are added from the Passport ("Add to trip")
      onAddStop: () => router.push("/passport"),
      onRemoveEntry: (_day, entryId) => void removeItem(trip.id, entryId),
      onMoveEntryToDay: (_from, entryId, toDay) =>
        void assignItemToDay(trip.id, entryId, dayNumberFromKey(trip, toDay)),
      // Reordering, times and notes need backend support, so they stay hidden
    };
  }, [trip, items, trips, router, deleteTrip, removeItem, assignItemToDay, openCreateTrip]);

  if (loading) {
    return (
      <div className={shell}>
        <div className="flex min-h-0 flex-1" role="status" aria-label="Loading your trip">
          <div className="w-full space-y-4 bg-card p-4 md:w-100 xl:w-[30%]">
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <Skeleton className="m-3 hidden flex-1 rounded-xl md:block" />
        </div>
      </div>
    );
  }

  if (!trip || !dashboardTrip || !controller) {
    return (
      <section className="bg-cream pb-24 pt-44">
        <div className="site-container max-w-xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#002E50] text-[#EBBD00]">
            <MapPin className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-[#002E50]">Trip not found</h1>
          <p className="mt-3 text-muted-foreground">This trip doesn&apos;t exist or was deleted.</p>
          <Link href="/my-trips" className="mt-7 inline-block">
            <Button variant="gold" size="lg">
              <ArrowLeft className="h-4 w-4" /> Back to My Trips
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className={shell}>
      <div className="border-b border-border bg-card px-4 py-2 print:hidden">
        <Link href="/my-trips" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden /> All trips
        </Link>
      </div>

      <TripDashboard trip={dashboardTrip} controller={controller} />

      <CreateTripDialog
        open={editing}
        mode="edit"
        onOpenChange={setEditing}
        initial={{ name: trip.name, location: tripLocation(trip), startDate: trip.startDate, endDate: trip.endDate }}
        onSubmit={async (input) => {
          if (await updateTrip(trip.id, input)) setEditing(false);
        }}
      />
    </div>
  );
}
