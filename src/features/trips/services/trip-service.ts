import type { NormalizedItem, TripInput, TripWithItems } from "../types";

/**
 * Every trip operation the UI needs. TripsProvider only talks to this
 * interface, so local and API storage are interchangeable.
 */
export interface TripService {
  getTrips(): Promise<TripWithItems[]>;
  getTripById(id: string): Promise<TripWithItems | null>;
  createTrip(input: TripInput): Promise<TripWithItems>;
  updateTrip(id: string, patch: Partial<TripInput>): Promise<TripWithItems>;
  deleteTrip(id: string): Promise<void>;
  /** Rejects with DuplicateTripItemError if the item is already in the trip */
  addItemToTrip(tripId: string, item: NormalizedItem): Promise<TripWithItems>;
  removeItemFromTrip(tripId: string, tripItemId: string): Promise<TripWithItems>;
  assignItemToDay(
    tripId: string,
    tripItemId: string,
    dayNumber: number | null,
  ): Promise<TripWithItems>;
}

export class TripNotFoundError extends Error {
  constructor(id: string) {
    super(`Trip ${id} not found`);
    this.name = "TripNotFoundError";
  }
}
