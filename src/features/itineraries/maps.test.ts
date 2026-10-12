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

const a = { name: "Rum Point", address: "Rum Point Dr, North Side" };
const b = { name: "Seven Mile Beach", address: "West Bay Rd" };
const c = { name: "Starfish Point", address: null };

describe("stopParam", () => {
  it("URL-encodes name and address", () => {
    expect(stopParam(a)).toBe("Rum%20Point%2C%20Rum%20Point%20Dr%2C%20North%20Side");
  });
  it("uses the name alone when there is no address", () => {
    expect(stopParam(c)).toBe("Starfish%20Point");
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
