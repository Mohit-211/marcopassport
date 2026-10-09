import { describe, expect, it } from "vitest";
import { normalizeBusiness, normalizePlace } from "./normalize";
import {
  DuplicateTripItemError,
  findTripItem,
  groupItemsByDay,
  newTrip,
  tripDayCount,
  validateTripInput,
  withItemAdded,
  withItemDay,
  withItemRemoved,
} from "./trip-logic";
import { createLocalTripService } from "./services/local-trip-service";

const place = normalizePlace({ id: 1, category_id: 1, name: "Beach", slug: "beach" });
const business = normalizeBusiness({ id: 1, name: "Cafe", slug: "cafe", is_in_passport: false });
const input = { name: "Weekend", location: "Marco Island, FL", startDate: "2026-11-06", endDate: "2026-11-08" };

function memoryStore() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

describe("duplicate prevention", () => {
  it("adds an item once and rejects the same item again", () => {
    const trip = withItemAdded(newTrip(input, null), place);
    expect(trip.items).toHaveLength(1);
    expect(() => withItemAdded(trip, place)).toThrow(DuplicateTripItemError);
  });

  it("reports the existing trip item so the UI can offer Remove", () => {
    const trip = withItemAdded(newTrip(input, null), place);
    try {
      withItemAdded(trip, { ...place });
      expect.unreachable();
    } catch (e) {
      expect((e as DuplicateTripItemError).existing.id).toBe(trip.items[0].id);
    }
  });

  it("treats a place and a business with the same id as different items", () => {
    const trip = withItemAdded(withItemAdded(newTrip(input, null), place), business);
    expect(trip.items).toHaveLength(2);
    expect(findTripItem(trip, business)?.source).toBe("business");
  });

  it("allows re-adding after removal", () => {
    const trip = withItemAdded(newTrip(input, null), place);
    const removed = withItemRemoved(trip, trip.items[0].id);
    expect(withItemAdded(removed, place).items).toHaveLength(1);
  });

  it("is enforced by the local service too", async () => {
    const service = createLocalTripService("guest", memoryStore());
    const trip = await service.createTrip(input);
    await service.addItemToTrip(trip.id, place);
    await expect(service.addItemToTrip(trip.id, place)).rejects.toBeInstanceOf(DuplicateTripItemError);
    expect((await service.getTripById(trip.id))?.items).toHaveLength(1);
  });
});

describe("days", () => {
  it("counts trip days inclusively", () => {
    expect(tripDayCount(input)).toBe(3);
    expect(tripDayCount({ startDate: "2026-11-06", endDate: "2026-11-06" })).toBe(1);
  });

  it("groups by day, with out-of-range days falling back to Unscheduled", () => {
    let trip = withItemAdded(withItemAdded(newTrip(input, null), place), business);
    trip = withItemDay(trip, trip.items[0].id, 2);
    trip = withItemDay(trip, trip.items[1].id, 9);
    const groups = groupItemsByDay(trip);
    expect(groups).toHaveLength(4);
    expect(groups[2].map((i) => i.sourceId)).toEqual(["1"]);
    expect(groups[0].map((i) => i.source)).toEqual(["business"]);
  });
});

describe("validateTripInput", () => {
  it("rejects empty names and end dates before the start", () => {
    expect(validateTripInput({ ...input, name: "  " })).toBeTruthy();
    expect(validateTripInput({ ...input, location: "" })).toBeTruthy();
    expect(validateTripInput({ ...input, endDate: "2026-11-01" })).toBeTruthy();
    expect(validateTripInput(input)).toBeNull();
  });
});
