/**
 * Google Maps JavaScript API loader.
 *
 * Set the key in `.env.local` (and in your hosting provider's env settings):
 *
 *   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
 *   NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your-map-id   # optional, needed for custom styling
 *
 * Next.js only exposes variables prefixed with NEXT_PUBLIC_ to the browser
 * (the Vite equivalent would be VITE_GOOGLE_MAPS_API_KEY). Restrict the key to
 * your domains in Google Cloud Console, since it is visible to visitors.
 *
 * Without a key the planner falls back to a simple built-in map preview.
 */
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// Google's demo map ID enables Advanced Markers without extra setup.
export const GOOGLE_MAPS_MAP_ID =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

export const MAPS_AUTH_FAILURE_EVENT = "marco:maps-auth-failure";

let loader: Promise<void> | null = null;

declare global {
  interface Window {
    __marcoMapsReady?: () => void;
    gm_authFailure?: () => void;
  }
}

export function loadGoogleMaps(): Promise<void> {
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error("Missing Google Maps API key"));
  }
  if (typeof window.google?.maps?.importLibrary === "function") return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    window.__marcoMapsReady = () => resolve();
    // Google calls this when the key is invalid or the domain isn't allowed
    window.gm_authFailure = () =>
      window.dispatchEvent(new Event(MAPS_AUTH_FAILURE_EVENT));

    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      v: "weekly",
      loading: "async",
      callback: "__marcoMapsReady",
    });
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.onerror = () => {
      loader = null;
      script.remove();
      reject(new Error("Google Maps failed to load"));
    };
    document.head.appendChild(script);
  });

  return loader;
}
