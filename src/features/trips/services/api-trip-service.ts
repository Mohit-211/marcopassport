import client from "@/api/client";
import { Trips } from "@/api/endpoints";
import { DuplicateTripItemError, findTripItem } from "../trip-logic";
import type { TripWithItems } from "../types";
import type { TripService } from "./trip-service";

/**
 * Trips stored on the backend for signed-in users.
 *
 * ASSUMED CONTRACT (update once the real endpoints are confirmed):
 *   - responses are wrapped like the rest of the API: `{ data: <payload> }`
 *   - every trip response includes its `items` array (TripWithItems)
 *   - item mutations return the full updated trip
 */
function unwrap<T>(res: { data?: { data?: T } & T }): T {
  return (res?.data?.data ?? res?.data) as T;
}

export function createApiTripService(): TripService {
  const service: TripService = {
    async getTrips() {
      const trips = unwrap<TripWithItems[]>(await client.get(Trips.LIST));
      return Array.isArray(trips) ? trips : [];
    },
    async getTripById(id) {
      return unwrap<TripWithItems>(await client.get(Trips.DETAIL(id))) ?? null;
    },
    async createTrip(input) {
      return unwrap<TripWithItems>(await client.post(Trips.LIST, input));
    },
    async updateTrip(id, patch) {
      return unwrap<TripWithItems>(await client.put(Trips.DETAIL(id), patch));
    },
    async deleteTrip(id) {
      await client.delete(Trips.DETAIL(id));
    },
    async addItemToTrip(tripId, item) {
      // Check locally first so guests and signed-in users get the same error
      const trip = await service.getTripById(tripId);
      const existing = trip && findTripItem(trip, item);
      if (existing) throw new DuplicateTripItemError(existing);
      return unwrap<TripWithItems>(
        await client.post(Trips.ITEMS(tripId), {
          source: item.source,
          sourceId: item.sourceId,
          normalizedSnapshot: item,
        }),
      );
    },
    async removeItemFromTrip(tripId, tripItemId) {
      return unwrap<TripWithItems>(await client.delete(Trips.ITEM(tripId, tripItemId)));
    },
    async assignItemToDay(tripId, tripItemId, dayNumber) {
      return unwrap<TripWithItems>(
        await client.patch(Trips.ITEM(tripId, tripItemId), { dayNumber }),
      );
    },
  };
  return service;
}
