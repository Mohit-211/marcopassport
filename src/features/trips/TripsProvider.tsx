"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { CreateTripDialog } from "./components/CreateTripDialog";
import { getTripService, createLocalTripService, type TripScope } from "./services";
import { localTripsKey } from "./services/local-trip-service";
import { DuplicateTripItemError, findTripItem, tripLocation } from "./trip-logic";
import type { NormalizedItem, TripInput, TripItem, TripWithItems } from "./types";

interface CreateDialogState {
  open: boolean;
  /** Added to the new trip right after it's created */
  pendingItem: NormalizedItem | null;
}

interface TripsContextValue {
  trips: TripWithItems[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  reload: () => void;

  getTrip: (id: string) => TripWithItems | undefined;
  /** Trips that already contain this item */
  tripsContaining: (item: NormalizedItem) => Array<{ trip: TripWithItems; tripItem: TripItem }>;

  openCreateTrip: (pendingItem?: NormalizedItem | null) => void;
  createTrip: (input: TripInput, pendingItem?: NormalizedItem | null) => Promise<TripWithItems | null>;
  updateTrip: (id: string, patch: Partial<TripInput>) => Promise<boolean>;
  deleteTrip: (id: string) => Promise<boolean>;
  addItem: (tripId: string, item: NormalizedItem) => Promise<boolean>;
  removeItem: (tripId: string, tripItemId: string) => Promise<boolean>;
  assignItemToDay: (tripId: string, tripItemId: string, dayNumber: number | null) => Promise<boolean>;
}

const TripsContext = createContext<TripsContextValue | null>(null);

const SAVE_ERROR = "We couldn't save that change. Please try again.";

function messageOf(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, ready } = useAuth();
  const scope: TripScope = isAuthenticated ? "account" : "guest";
  const service = useMemo(() => (ready ? getTripService(scope) : null), [ready, scope]);

  const [trips, setTrips] = useState<TripWithItems[]>([]);
  const [loadedScope, setLoadedScope] = useState<TripScope | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<CreateDialogState>({ open: false, pendingItem: null });
  const loading = loadedScope !== scope;

  useEffect(() => {
    if (!service) return;
    let cancelled = false;
    service
      .getTrips()
      .then((list) => {
        if (cancelled) return;
        setTrips(list);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setTrips([]);
        setError("We couldn't load your trips. Please refresh and try again.");
      })
      .finally(() => {
        if (!cancelled) setLoadedScope(scope);
      });
    return () => {
      cancelled = true;
    };
  }, [service, scope, reloadKey]);

  const replaceTrip = useCallback((trip: TripWithItems) => {
    setTrips((prev) => prev.map((t) => (t.id === trip.id ? trip : t)));
  }, []);

  const removeItem = useCallback<TripsContextValue["removeItem"]>(
    async (tripId, tripItemId) => {
      if (!service) return false;
      try {
        const trip = await service.removeItemFromTrip(tripId, tripItemId);
        replaceTrip(trip);
        toast.success(`Removed from ${trip.name}`);
        return true;
      } catch (e) {
        toast.error(messageOf(e, SAVE_ERROR));
        return false;
      }
    },
    [service, replaceTrip],
  );

  const addItem = useCallback<TripsContextValue["addItem"]>(
    async (tripId, item) => {
      if (!service) return false;
      try {
        const trip = await service.addItemToTrip(tripId, item);
        replaceTrip(trip);
        toast.success(`Added to ${trip.name}`, { description: item.name });
        return true;
      } catch (e) {
        if (e instanceof DuplicateTripItemError) {
          toast.info("Already in Trip", {
            description: item.name,
            action: { label: "Remove", onClick: () => void removeItem(tripId, e.existing.id) },
          });
        } else {
          toast.error(messageOf(e, SAVE_ERROR));
        }
        return false;
      }
    },
    [service, replaceTrip, removeItem],
  );

  const createTrip = useCallback<TripsContextValue["createTrip"]>(
    async (input, pendingItem) => {
      if (!service) return null;
      try {
        let trip = await service.createTrip(input);
        if (pendingItem) trip = await service.addItemToTrip(trip.id, pendingItem);
        setTrips((prev) => [...prev, trip]);
        toast.success(
          pendingItem ? `Added to ${trip.name}` : `Created ${trip.name}`,
          pendingItem ? { description: pendingItem.name } : undefined,
        );
        return trip;
      } catch (e) {
        toast.error(messageOf(e, SAVE_ERROR));
        return null;
      }
    },
    [service],
  );

  const updateTrip = useCallback<TripsContextValue["updateTrip"]>(
    async (id, patch) => {
      if (!service) return false;
      try {
        replaceTrip(await service.updateTrip(id, patch));
        toast.success("Trip updated");
        return true;
      } catch (e) {
        toast.error(messageOf(e, SAVE_ERROR));
        return false;
      }
    },
    [service, replaceTrip],
  );

  const deleteTrip = useCallback<TripsContextValue["deleteTrip"]>(
    async (id) => {
      if (!service) return false;
      try {
        await service.deleteTrip(id);
        setTrips((prev) => prev.filter((t) => t.id !== id));
        toast.success("Trip deleted");
        return true;
      } catch (e) {
        toast.error(messageOf(e, SAVE_ERROR));
        return false;
      }
    },
    [service],
  );

  const assignItemToDay = useCallback<TripsContextValue["assignItemToDay"]>(
    async (tripId, tripItemId, dayNumber) => {
      if (!service) return false;
      try {
        replaceTrip(await service.assignItemToDay(tripId, tripItemId, dayNumber));
        return true;
      } catch (e) {
        toast.error(messageOf(e, SAVE_ERROR));
        return false;
      }
    },
    [service, replaceTrip],
  );

  // After sign-in, offer to move trips made as a guest into the account
  const offeredSync = useRef(false);
  useEffect(() => {
    if (!isAuthenticated || !service || loading || offeredSync.current) return;
    offeredSync.current = true;
    const guest = createLocalTripService("guest");
    guest.getTrips().then((guestTrips) => {
      if (guestTrips.length === 0) return;
      toast(`You have ${guestTrips.length} trip${guestTrips.length > 1 ? "s" : ""} saved on this device`, {
        description: "Add them to your account so they're available everywhere.",
        duration: Infinity,
        action: {
          label: "Sync",
          onClick: async () => {
            try {
              for (const g of guestTrips) {
                const trip = await service.createTrip({ ...g, location: tripLocation(g) });
                for (const item of g.items) {
                  await service.addItemToTrip(trip.id, item.normalizedSnapshot);
                  // Keep day assignments
                  if (item.dayNumber !== null) {
                    const saved = (await service.getTripById(trip.id))!;
                    const added = findTripItem(saved, item);
                    if (added) await service.assignItemToDay(trip.id, added.id, item.dayNumber);
                  }
                }
              }
              window.localStorage.removeItem(localTripsKey("guest"));
              setReloadKey((k) => k + 1);
              toast.success("Trips synced to your account");
            } catch {
              toast.error("Some trips couldn't be synced. They're still saved on this device.");
            }
          },
        },
      });
    });
  }, [isAuthenticated, service, loading]);
  useEffect(() => {
    if (!isAuthenticated) offeredSync.current = false;
  }, [isAuthenticated]);

  const value = useMemo<TripsContextValue>(
    () => ({
      trips,
      loading,
      error,
      isAuthenticated,
      reload: () => setReloadKey((k) => k + 1),
      getTrip: (id) => trips.find((t) => t.id === id),
      tripsContaining: (item) =>
        trips.flatMap((trip) => {
          const tripItem = findTripItem(trip, item);
          return tripItem ? [{ trip, tripItem }] : [];
        }),
      openCreateTrip: (pendingItem = null) => setDialog({ open: true, pendingItem }),
      createTrip,
      updateTrip,
      deleteTrip,
      addItem,
      removeItem,
      assignItemToDay,
    }),
    [trips, loading, error, isAuthenticated, createTrip, updateTrip, deleteTrip, addItem, removeItem, assignItemToDay],
  );

  return (
    <TripsContext.Provider value={value}>
      {children}
      <CreateTripDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        pendingItem={dialog.pendingItem}
        onSubmit={async (input) => {
          const trip = await createTrip(input, dialog.pendingItem);
          if (trip) setDialog({ open: false, pendingItem: null });
        }}
      />
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used inside <TripsProvider>");
  return ctx;
}
