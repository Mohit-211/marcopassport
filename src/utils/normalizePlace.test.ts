import { describe, expect, it } from "vitest";
import { hasCoordinates, normalizePlace } from "./normalizePlace";

describe("normalizePlace", () => {
  it("maps a complete place", () => {
    const place = normalizePlace({
      id: 3,
      category_id: 1,
      name: "Marco Island Historical Museum",
      slug: "museum",
      categories: [{ id: 1, name: "Museums", slug: "museums" }],
      address: "180 S Heathwood Dr",
      latitude: 25.94,
      longitude: -81.71,
      featured_image: "https://cdn.example.com/museum.jpg",
      rating: "4.8",
      phone: "239-252-1440",
      website_url: "https://example.org",
      short_description: "Calusa artifacts",
    });
    expect(place).toEqual({
      id: "place-3",
      sourceId: "3",
      name: "Marco Island Historical Museum",
      category: "Museums",
      address: "180 S Heathwood Dr",
      lat: 25.94,
      lng: -81.71,
      image: "https://cdn.example.com/museum.jpg",
      rating: 4.8,
      phone: "239-252-1440",
      website: "https://example.org",
      description: "Calusa artifacts",
    });
    expect(hasCoordinates(place)).toBe(true);
  });

  it("uses defaults for missing fields and keeps the place off the map", () => {
    const place = normalizePlace({ id: 9, category_id: 1, name: "", slug: "", latitude: null });
    expect(place).toMatchObject({
      name: "Untitled place",
      category: "Place",
      address: "",
      lat: null,
      lng: null,
      image: null,
      rating: null,
      phone: null,
      website: null,
      description: "",
    });
    expect(hasCoordinates(place)).toBe(false);
  });
});
