import { GetAllPlacesApi } from "@/api/users/places.api";
import { EXAMPLE_PLACES } from "@/data/example-places";
import type { ApiPlace } from "@/types/place";
import { normalizePlace, type Place } from "@/utils/normalizePlace";

/** The /example page uses dummy data; set to false to call the real Places API. */
const USE_DUMMY_DATA = true;

async function fetchRawPlaces(): Promise<unknown> {
  if (USE_DUMMY_DATA) {
    // Short delay so the loading state is visible, like a real request
    await new Promise((resolve) => setTimeout(resolve, 400));
    return EXAMPLE_PLACES;
  }
  const res = await GetAllPlacesApi();
  return res?.data?.data?.places;
}

/** Places in the common model (dummy data or GET /explore/places). */
export async function getPlaces(): Promise<Place[]> {
  const raw = await fetchRawPlaces();
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p): p is ApiPlace => !!p && typeof p === "object" && p.id != null)
    .map(normalizePlace);
}
