import { describe, expect, it } from "vitest";
import {
  directionsToUrl,
  directionsUrl,
  embedMapSrc,
  placeSearchUrl,
  routeUrl,
  stopLetter,
  stopParam,
} from "./maps";

const a = { name: "Marco Fun", address: "1001 N Barfield Dr, Marco Island, FL 34145" };
const b = { name: "Tigertail Beach", address: "480 Hernando Dr" };
const c = { name: "South Beach", address: null };

describe("stopParam", () => {
  it("URL-encodes name and address", () => {
    expect(stopParam(a)).toBe("Marco%20Fun%2C%201001%20N%20Barfield%20Dr%2C%20Marco%20Island%2C%20FL%2034145");
  });

  it("adds the island when the address doesn't say where it is", () => {
    expect(decodeURIComponent(stopParam(b))).toBe("Tigertail Beach, 480 Hernando Dr, Marco Island, FL");
    expect(decodeURIComponent(stopParam(c))).toBe("South Beach, Marco Island, FL");
  });

  it("leaves addresses that name a state, ZIP or the island as they are", () => {
    for (const address of [
      "20200 Tamiami Trl E, Naples, FL 34114",
      "1001 N Barfield Dr Marco Island FL 34145",
      "Goodland, Florida",
      "290 S Collier Blvd 34145",
      "290 S Collier Blvd, Marco Island",
    ]) {
      expect(decodeURIComponent(stopParam({ name: "X", address }))).toBe(`X, ${address}`);
    }
  });

  it("doesn't mistake a five-digit house number for a ZIP", () => {
    expect(decodeURIComponent(stopParam({ name: "X", address: "10500 Collier Blvd" }))).toBe(
      "X, 10500 Collier Blvd, Marco Island, FL",
    );
  });
});

describe("embedMapSrc", () => {
  it("is null without places or without a key", () => {
    expect(embedMapSrc([], "driving", "KEY")).toBeNull();
    expect(embedMapSrc([a], "driving", "")).toBeNull();
  });

  it("pins a single place", () => {
    expect(embedMapSrc([a], "driving", "KEY")).toBe(
      `https://www.google.com/maps/embed/v1/place?key=KEY&q=${stopParam(a)}`,
    );
  });

  it("routes origin → waypoints → destination in order", () => {
    expect(embedMapSrc([a, b, c], "walking", "KEY")).toBe(
      `https://www.google.com/maps/embed/v1/directions?key=KEY&origin=${stopParam(a)}` +
        `&destination=${stopParam(c)}&waypoints=${stopParam(b)}&mode=walking`,
    );
  });

  it("leaves out waypoints for two stops", () => {
    expect(embedMapSrc([a, b], "driving", "KEY")).not.toContain("waypoints");
  });

  it("separates waypoints with a literal pipe", () => {
    const src = embedMapSrc([a, b, c, a], "driving", "KEY")!;
    expect(src).toContain(`&waypoints=${stopParam(b)}|${stopParam(c)}&`);
  });
});

describe("Maps URLs", () => {
  it("links one leg", () => {
    expect(directionsUrl(a, b)).toBe(
      `https://www.google.com/maps/dir/?api=1&origin=${stopParam(a)}&destination=${stopParam(b)}&travelmode=driving`,
    );
  });

  it("links a single listing", () => {
    expect(placeSearchUrl(a)).toBe(`https://www.google.com/maps/search/?api=1&query=${stopParam(a)}`);
    expect(directionsToUrl(a)).toBe(
      `https://www.google.com/maps/dir/?api=1&destination=${stopParam(a)}&travelmode=driving`,
    );
  });

  it("links the whole route with waypoints", () => {
    expect(routeUrl([a, b, c])).toContain(`&waypoints=${stopParam(b)}&travelmode=driving`);
    expect(routeUrl([a])).toBeNull();
  });
});

describe("stopLetter", () => {
  it("letters stops like the embed pins", () => {
    expect([0, 1, 19].map(stopLetter)).toEqual(["A", "B", "T"]);
  });
});
