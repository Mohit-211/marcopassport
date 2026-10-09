import type { Trip } from "@/types/trip";

/**
 * Everything the planner needs from storage. The UI only talks to this
 * interface, so moving from the browser to Supabase or Firebase means writing
 * one new implementation and returning it from `getTripRepository`.
 *
 * Example Supabase adapter (table `trips` with columns id, user_id, data jsonb):
 *
 *   list:   supabase.from("trips").select("data").eq("user_id", uid)
 *   save:   supabase.from("trips").upsert({ id: trip.id, user_id: uid, data: trip })
 *   remove: supabase.from("trips").delete().eq("id", id)
 */
export interface TripRepository {
  list(): Promise<Trip[]>;
  save(trip: Trip): Promise<Trip>;
  remove(id: string): Promise<void>;
}

const STORAGE_PREFIX = "marco-passport:trips";

/**
 * Prototype storage in localStorage. Fine for a demo, but trips stay on one
 * device and are lost when site data is cleared, so swap it for a backend
 * before launch.
 */
export function createLocalTripRepository(namespace: string): TripRepository {
  const key = `${STORAGE_PREFIX}:${namespace}`;

  const read = (): Trip[] => {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  };

  const write = (trips: Trip[]) => {
    window.localStorage.setItem(key, JSON.stringify(trips));
  };

  return {
    async list() {
      return read();
    },
    async save(trip) {
      const trips = read();
      const index = trips.findIndex((t) => t.id === trip.id);
      if (index === -1) trips.push(trip);
      else trips[index] = trip;
      write(trips);
      return trip;
    },
    async remove(id) {
      write(read().filter((t) => t.id !== id));
    },
  };
}

export type TripScope = "guest" | "account";

export function getTripRepository(scope: TripScope): TripRepository {
  // Signed-in users should be backed by the API once it exists, e.g.
  // `return scope === "account" ? createSupabaseTripRepository(userId) : ...`
  return createLocalTripRepository(scope);
}

/** Guests can keep a single trip; signed-in users can keep as many as they like. */
export const GUEST_TRIP_LIMIT = 1;
