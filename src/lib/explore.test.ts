import { describe, expect, it } from "vitest";
import { matchesSearch, type ExploreItem } from "./explore";

const item = (over: Partial<ExploreItem>): ExploreItem => ({
  id: 1,
  type: "place",
  slug: "south-beach",
  name: "South Beach",
  description: "Beautiful beach for swimming and shelling.",
  image: "",
  imagePath: null,
  categories: [{ id: 1, name: "Beaches", slug: "beaches", type: "place" }],
  category: "Beaches",
  location: "",
  address: "870 County Rd 953, Marco Island, FL",
  latitude: null,
  longitude: null,
  price: null,
  rating: null,
  reviewCount: 0,
  featured: false,
  topPick: false,
  href: "/places/south-beach",
  ...over,
});

describe("matchesSearch", () => {
  const beach = item({});
  const rentals = item({
    type: "business",
    name: "Big Marco Boat Rentals",
    description: "Deck boats and pontoons.",
    categories: [{ id: 2, name: "Boat Rentals", slug: "boat-rentals", type: "business" }],
    address: "290 S Collier Blvd #310",
  });

  it("matches every word in any order", () => {
    expect(matchesSearch(beach, "beach south")).toBe(true);
    expect(matchesSearch(rentals, "rentals boat marco")).toBe(true);
    expect(matchesSearch(beach, "south beach marco island")).toBe(true);
  });

  it("matches plurals against singulars", () => {
    expect(matchesSearch(beach, "beaches")).toBe(true);
    expect(matchesSearch(rentals, "boats")).toBe(true);
  });

  it("needs every word to appear", () => {
    expect(matchesSearch(beach, "beach kayak")).toBe(false);
    expect(matchesSearch(rentals, "beach")).toBe(false);
  });

  it("ignores case, punctuation and an empty query", () => {
    expect(matchesSearch(rentals, "  BOAT-rentals!  ")).toBe(true);
    expect(matchesSearch(beach, "")).toBe(true);
    expect(matchesSearch(beach, "   ")).toBe(true);
  });
});
