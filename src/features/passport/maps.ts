import type { PassportPlace } from "./types";

/**
 * Google Maps URLs for passports, kept to the two free options (backend
 * docs/frontend-handoff.md §4): the Maps Embed API iframe and plain Maps URLs.
 * Never use the Maps JavaScript, Directions, Places or Geocoding APIs here:
 * they're billed per call. Each stop is "name, address", which both the embed
 * and Maps URLs resolve themselves, so nothing is geocoded on our side.
 */

const MAPS_EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY ?? "";

export type TravelMode = "driving" | "walking";

type Stop = Pick<PassportPlace, "name" | "address">;

/**
 * Admins don't always type the town ("480 Hernando drive"), and Google then
 * matches a street of that name anywhere, or a same-named place such as Miami's
 * South Beach. Places are on or around Marco Island, so an address that names
 * no state, ZIP or the island gets it added. Still free: Google resolves the text.
 */
const DEFAULT_LOCALITY = "Marco Island, FL";
const HAS_LOCALITY = /\b(fl|florida)\b|marco island|\b\d{5}(-\d{4})?\s*$/i;

/** URL-encoded "name, address" for one stop, with the town added when the address has none. */
export function stopParam(place: Stop) {
  const address = place.address?.trim() ?? "";
  const town = HAS_LOCALITY.test(address) ? null : DEFAULT_LOCALITY;
  const label = [place.name, address, town].map((part) => part?.trim()).filter(Boolean).join(", ");
  return encodeURIComponent(label);
}

/** Lettered pins on the embed map: A, B, C… in visiting order. */
export function stopLetter(index: number) {
  return String.fromCharCode(65 + index);
}

/**
 * The iframe src: a single pin for one stop, the whole route for 2+, null for
 * none. The backend caps passports at 20 places, which fits one embed
 * (origin + destination + up to 18 of Google's 20 allowed waypoints).
 */
export function embedMapSrc(places: Stop[], mode: TravelMode = "driving", key = MAPS_EMBED_KEY) {
  if (!key || places.length === 0) return null;
  const k = encodeURIComponent(key);
  const stops = places.map(stopParam);
  if (stops.length === 1) {
    return `https://www.google.com/maps/embed/v1/place?key=${k}&q=${stops[0]}`;
  }
  const waypoints = stops.slice(1, -1);
  return (
    `https://www.google.com/maps/embed/v1/directions?key=${k}` +
    `&origin=${stops[0]}&destination=${stops[stops.length - 1]}` +
    (waypoints.length ? `&waypoints=${waypoints.join("|")}` : "") +
    `&mode=${mode}`
  );
}

/** "Directions" link from one stop to the next; opens Google Maps, no key needed. */
export function directionsUrl(from: Stop, to: Stop, mode: TravelMode = "driving") {
  return `https://www.google.com/maps/dir/?api=1&origin=${stopParam(from)}&destination=${stopParam(to)}&travelmode=${mode}`;
}

/**
 * "Open whole route in Google Maps". Google limits waypoints in these links
 * (fewer on mobile), so the per-leg links are the reliable option.
 */
export function routeUrl(places: Stop[], mode: TravelMode = "driving") {
  if (places.length < 2) return null;
  const stops = places.map(stopParam);
  const waypoints = stops.slice(1, -1);
  return (
    `https://www.google.com/maps/dir/?api=1&origin=${stops[0]}&destination=${stops[stops.length - 1]}` +
    (waypoints.length ? `&waypoints=${waypoints.join("|")}` : "") +
    `&travelmode=${mode}`
  );
}

/** "Open in Google Maps" for a single place (Maps URL, no key). */
export function placeSearchUrl(place: Stop) {
  return `https://www.google.com/maps/search/?api=1&query=${stopParam(place)}`;
}

/** "Get directions" to a single place from wherever the visitor is (Maps URL, no key). */
export function directionsToUrl(place: Stop, mode: TravelMode = "driving") {
  return `https://www.google.com/maps/dir/?api=1&destination=${stopParam(place)}&travelmode=${mode}`;
}
