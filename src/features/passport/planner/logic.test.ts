import { describe, expect, it } from "vitest";
import type { ExploreItem } from "@/lib/explore";
import { emptyDraft } from "../logic";
import {
  categoryOptions,
  decodeSharedTrip,
  DEFAULT_FILTERS,
  distanceMiles,
  encodeSharedTrip,
  filterPlaces,
  MARCO_ISLAND,
  milesFromCentre,
} from "./logic";

function item(id: number, patch: Partial<ExploreItem> = {}): ExploreItem {
  return {
    id,
    type: "business",
    slug: `item-${id}`,
    name: `Item ${id}`,
    description: "",
    image: "",
    imagePath: null,
    categories: [],
    category: "Business",
    location: "Marco Island",
    address: null,
    latitude: null,
    longitude: null,
    price: null,
    rating: null,
    reviewCount: 0,
    featured: false,
    topPick: false,
    href: `/explore/item-${id}`,
    ...patch,
  };
}

const cat = (name: string) => ({ id: 1, name, slug: name.toLowerCase().replace(/ /g, "-"), type: "business" as const });

describe("filterPlaces", () => {
  const items = [
    item(1, { name: "Crab Shack", categories: [cat("Restaurants")] }),
    item(2, { name: "Boat Co", categories: [cat("Boat Rentals")] }),
    item(3, { name: "Tigertail Beach", type: "place", featured: true }),
    item(4, { name: "Island Inn", categories: [cat("Hotels")] }),
  ];
  const run = (patch: Partial<typeof DEFAULT_FILTERS>) =>
    filterPlaces(items, { ...DEFAULT_FILTERS, ...patch }).map((i) => i.id);

  it("filters by search and by any of the chosen categories", () => {
    expect(run({})).toEqual([1, 2, 3, 4]);
    expect(run({ query: "crab" })).toEqual([1]);
    expect(run({ categories: ["hotels"] })).toEqual([4]);
    expect(run({ categories: ["restaurants", "boat-rentals"] })).toEqual([1, 2]);
    expect(run({ query: "boat", categories: ["hotels"] })).toEqual([]);
  });
});

describe("categoryOptions", () => {
  it("counts each category once per place, by slug, sorted by name", () => {
    const items = [
      item(1, { categories: [cat("Hotels")] }),
      item(2, { categories: [cat("Hotels"), cat("Boat Rentals"), cat("Hotels")] }),
    ];
    expect(categoryOptions(items)).toEqual([
      { slug: "boat-rentals", name: "Boat Rentals", count: 1 },
      { slug: "hotels", name: "Hotels", count: 2 },
    ]);
  });
});

describe("distanceMiles", () => {
  it("is zero at the same point and about 69 miles per degree of latitude", () => {
    expect(distanceMiles(MARCO_ISLAND, MARCO_ISLAND)).toBe(0);
    expect(distanceMiles({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeCloseTo(69.1, 0);
  });
});

describe("milesFromCentre", () => {
  it("measures from the island and ignores coordinates that can't be right", () => {
    expect(milesFromCentre(item(1, { latitude: 25.95, longitude: -81.74 }))).toBeLessThan(2);
    // A place saved at 23.76, 120.69 (Taiwan) shouldn't read "8,600 mi".
    expect(milesFromCentre(item(2, { latitude: 23.76, longitude: 120.69 }))).toBeNull();
    expect(milesFromCentre(item(3))).toBeNull();
  });
});

describe("shared trip links", () => {
  it("round-trips name, dates and stops", () => {
    const draft = {
      ...emptyDraft(),
      name: "Café weekend ☀",
      start_date: "2026-11-01",
      end_date: "2026-11-03",
      items: [
        { place_id: 5, visit_date: "2026-11-01", place: { id: 5, name: "A", slug: "a" } },
        { place_id: 9, visit_date: null, place: { id: 9, name: "B", slug: "b" } },
      ],
    };
    expect(decodeSharedTrip(encodeSharedTrip(draft))).toEqual({
      name: "Café weekend ☀",
      start_date: "2026-11-01",
      end_date: "2026-11-03",
      stops: [
        { id: 5, date: "2026-11-01" },
        { id: 9, date: null },
      ],
    });
  });

  it("rejects garbage and drops bad stops", () => {
    expect(decodeSharedTrip("not-base64!!")).toBeNull();
    expect(decodeSharedTrip(undefined)).toBeNull();
    const raw = btoa(JSON.stringify({ n: "", s: "nope", i: [[1, "bad"], [1], [-2], ["x"], [3]] }));
    expect(decodeSharedTrip(raw)).toEqual({
      name: "Marco Island trip",
      start_date: null,
      end_date: null,
      stops: [
        { id: 1, date: null },
        { id: 3, date: null },
      ],
    });
  });
});
