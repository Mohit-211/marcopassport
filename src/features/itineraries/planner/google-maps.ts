/**
 * Loads the Google Maps JavaScript API once, for the "Plan my trip" map.
 *
 * Unlike the itinerary map (Embed API, free; see ../maps.ts) this is billed per
 * map load, so it only loads when the planner opens. Use a browser key
 * restricted to this site's domains and to the Maps JavaScript API only.
 * Advanced markers need a Map ID; "DEMO_MAP_ID" is Google's development one.
 */

export const MAPS_JS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_KEY ?? "";
export const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

/* Just the parts of the Maps API the planner uses (no @types dependency). */
export interface LatLng {
  lat: number;
  lng: number;
}
export interface GMap {
  panTo(pos: LatLng): void;
  setZoom(zoom: number): void;
  getZoom(): number | undefined;
  setCenter(pos: LatLng): void;
  fitBounds(bounds: GBounds, padding?: number): void;
}
export interface GBounds {
  extend(pos: LatLng): void;
}
export interface GMarker {
  map: GMap | null;
  zIndex: number | null;
  content: HTMLElement | null;
  addListener(event: "click", handler: () => void): { remove(): void };
}
export interface GPolyline {
  setMap(map: GMap | null): void;
  setPath(path: LatLng[]): void;
}
export interface GoogleMapsApi {
  Map: new (el: HTMLElement, options: Record<string, unknown>) => GMap;
  LatLngBounds: new () => GBounds;
  Polyline: new (options: Record<string, unknown>) => GPolyline;
  AdvancedMarkerElement: new (options: Record<string, unknown>) => GMarker;
}

type ImportLibrary = (name: string) => Promise<Record<string, unknown>>;

declare global {
  interface Window {
    google?: { maps?: { importLibrary?: ImportLibrary } };
    __mpMapsReady?: () => void;
    gm_authFailure?: () => void;
  }
}

let loading: Promise<GoogleMapsApi> | null = null;

/** Rejects when there's no key, the script can't load, or Google rejects the key. */
export function loadGoogleMaps(): Promise<GoogleMapsApi> {
  if (!MAPS_JS_KEY) return Promise.reject(new Error("missing-key"));
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    if (typeof window.google?.maps?.importLibrary === "function") return resolve();
    window.__mpMapsReady = () => resolve();
    window.gm_authFailure = () => reject(new Error("auth-failure"));
    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(MAPS_JS_KEY)}` +
      `&v=weekly&loading=async&callback=__mpMapsReady`;
    script.async = true;
    script.onerror = () => reject(new Error("network"));
    document.head.append(script);
  })
    .then(async () => {
      const importLibrary = window.google!.maps!.importLibrary!;
      const [maps, core, marker] = await Promise.all([
        importLibrary("maps"),
        importLibrary("core"),
        importLibrary("marker"),
      ]);
      return {
        Map: maps.Map,
        Polyline: maps.Polyline,
        LatLngBounds: core.LatLngBounds,
        AdvancedMarkerElement: marker.AdvancedMarkerElement,
      } as GoogleMapsApi;
    })
    .catch((error) => {
      loading = null; // let a later open retry
      throw error;
    });
  return loading;
}

export function mapsErrorMessage(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (code === "missing-key") return "The map isn't set up yet. You can still browse and add places from the list.";
  if (code === "auth-failure") return "Google Maps rejected this site's key. You can still use the list.";
  return "The map couldn't load. Check your connection; the list still works.";
}
