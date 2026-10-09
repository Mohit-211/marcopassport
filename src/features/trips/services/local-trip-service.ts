import {
  newTrip,
  tripLocation,
  validateTripInput,
  withItemAdded,
  withItemDay,
  withItemRemoved,
} from "../trip-logic";
import type { TripWithItems } from "../types";
import { TripNotFoundError, type TripService } from "./trip-service";

const STORAGE_PREFIX = "marco-passport:my-trips";

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function localTripsKey(namespace: string) {
  return `${STORAGE_PREFIX}:${namespace}`;
}

/**
 * Trips kept in browser storage. Used for guests, and for signed-in users until
 * the trips API is enabled (see TRIPS_API_ENABLED).
 */
export function createLocalTripService(
  namespace: string,
  store: KeyValueStore = window.localStorage,
): TripService {
  const key = localTripsKey(namespace);

  const read = (): TripWithItems[] => {
    const raw = store.getItem(key);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const write = (trips: TripWithItems[]) => store.setItem(key, JSON.stringify(trips));

  const update = (id: string, change: (trip: TripWithItems) => TripWithItems) => {
    const trips = read();
    const index = trips.findIndex((t) => t.id === id);
    if (index === -1) throw new TripNotFoundError(id);
    const next = change(trips[index]);
    trips[index] = next;
    write(trips);
    return next;
  };

  return {
    async getTrips() {
      return read();
    },
    async getTripById(id) {
      return read().find((t) => t.id === id) ?? null;
    },
    async createTrip(input) {
      const error = validateTripInput(input);
      if (error) throw new Error(error);
      const trip = newTrip(input, namespace === "guest" ? null : namespace);
      write([...read(), trip]);
      return trip;
    },
    async updateTrip(id, patch) {
      return update(id, (trip) => {
        const next = { ...trip, location: tripLocation(trip), ...patch, updatedAt: new Date().toISOString() };
        const error = validateTripInput(next);
        if (error) throw new Error(error);
        return next;
      });
    },
    async deleteTrip(id) {
      write(read().filter((t) => t.id !== id));
    },
    async addItemToTrip(tripId, item) {
      return update(tripId, (trip) => withItemAdded(trip, item));
    },
    async removeItemFromTrip(tripId, tripItemId) {
      return update(tripId, (trip) => withItemRemoved(trip, tripItemId));
    },
    async assignItemToDay(tripId, tripItemId, dayNumber) {
      return update(tripId, (trip) => withItemDay(trip, tripItemId, dayNumber));
    },
  };
}
