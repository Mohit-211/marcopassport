import { describe, expect, it } from "vitest";
import type { ApiPlace } from "@/types/place";
import type { ApiBusiness } from "@/types/business";
import { FALLBACK_IMAGE, normalizeBusiness, normalizeList, normalizePlace } from "./normalize";

describe("normalizePlace", () => {
  it("maps a full place into the common model", () => {
    const raw: ApiPlace = {
      id: 12,
      category_id: 3,
      name: " Tigertail Beach ",
      slug: "tigertail-beach",
      categories: [{ id: 3, name: "Beaches", slug: "beaches" }],
      address: "490 Hernando Dr",
      latitude: 25.95,
      longitude: -81.74,
      featured_image: "https://cdn.example.com/beach.jpg",
      rating: "4.7",
      phone: "555-0100",
      website_url: "https://example.com",
      hours: "Sunrise–sunset",
      short_description: "Lagoon and sandbar",
    };
    expect(normalizePlace(raw)).toEqual({
      id: "places:12",
      source: "places",
      sourceId: "12",
      slug: "tigertail-beach",
      name: "Tigertail Beach",
      category: "Beaches",
      address: "490 Hernando Dr",
      lat: 25.95,
      lng: -81.74,
      image: "https://cdn.example.com/beach.jpg",
      rating: 4.7,
      phone: "555-0100",
      website: "https://example.com",
      openingHours: "Sunrise–sunset",
      description: "Lagoon and sandbar",
    });
  });

  it("fills in safe defaults when fields are missing", () => {
    const item = normalizePlace({ id: 5, category_id: 1, name: "", slug: "" });
    expect(item).toMatchObject({
      id: "places:5",
      name: "Untitled place",
      category: "Place",
      address: "",
      lat: null,
      lng: null,
      image: FALLBACK_IMAGE,
      rating: null,
      phone: null,
      website: null,
      openingHours: null,
      description: "",
    });
  });

  it("treats invalid coordinates and zero ratings as missing", () => {
    const item = normalizePlace({
      id: 1, category_id: 1, name: "x", slug: "x",
      latitude: null, longitude: "abc" as unknown as number, rating: 0,
    });
    expect(item.lat).toBeNull();
    expect(item.lng).toBeNull();
    expect(item.rating).toBeNull();
  });
});

describe("normalizeBusiness", () => {
  it("uses the business source and falls back to neighborhood and tagline", () => {
    const raw: ApiBusiness = {
      id: 7,
      name: "Sunset Grill",
      slug: "sunset-grill",
      is_in_passport: false,
      neighborhood: "Old Marco",
      tagline: "Waterfront seafood",
    };
    expect(normalizeBusiness(raw)).toMatchObject({
      id: "business:7",
      source: "business",
      sourceId: "7",
      category: "Business",
      address: "Old Marco",
      description: "Waterfront seafood",
    });
  });

  it("gives places and businesses with the same numeric id different keys", () => {
    const place = normalizePlace({ id: 1, category_id: 1, name: "a", slug: "a" });
    const business = normalizeBusiness({ id: 1, name: "b", slug: "b", is_in_passport: false });
    expect(place.id).not.toBe(business.id);
  });
});

describe("normalizeList", () => {
  it("returns [] for non-arrays and skips entries without an id", () => {
    expect(normalizeList(undefined, normalizePlace)).toEqual([]);
    expect(normalizeList({ places: [] }, normalizePlace)).toEqual([]);
    const items = normalizeList([{ id: 1, name: "a" }, null, { name: "no id" }], normalizePlace);
    expect(items.map((i) => i.id)).toEqual(["places:1"]);
  });
});
