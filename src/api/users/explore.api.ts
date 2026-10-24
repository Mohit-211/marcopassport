import { GetAllBusinessApi, GetBusinessDetailsBySlugApi } from "./business.api";
import { GetAllPlacesApi, GetPlacesDetailsBySlugApi, type ListParams } from "./places.api";
import { isNotFoundError } from "@/errors/apiError";
import { toExploreItem, type ExploreItem, type ExploreType } from "@/lib/explore";
import type { ApiExploreItem } from "@/types/explore";

// The list endpoints page at 15 by default. Explore filters on the client, so
// it asks for everything in one go (see the backend note about a combined,
// server-filtered endpoint).
const ALL = 500;

export interface ExploreResult {
  items: ExploreItem[];
  /** One of the API's two lists failed to load; the rest is still shown */
  partial: boolean;
}

/**
 * Everything Explore shows, in one list. The API still serves places to visit
 * and businesses from separate endpoints, so this asks both.
 */
export async function fetchExploreItems(params: ListParams = { limit: ALL }): Promise<ExploreResult> {
  const lists = await Promise.allSettled([GetAllPlacesApi(params), GetAllBusinessApi(params)]);
  const types: ExploreType[] = ["place", "business"];
  const items: ExploreItem[] = [];
  lists.forEach((list, i) => {
    if (list.status !== "fulfilled") return;
    const rows: ApiExploreItem[] = list.value?.data?.data?.places ?? [];
    items.push(...rows.map((row) => toExploreItem(row, types[i])));
  });
  const failures = lists.filter((list) => list.status === "rejected").length;
  if (failures === lists.length) throw new Error("Couldn't load places");
  return { items, partial: failures > 0 };
}

/**
 * One place by its slug, or undefined when there's none. Slugs are unique
 * across places to visit and businesses, but the API looks each type up on
 * its own endpoint, so both are asked at once. Failures other than "not
 * found" throw, so the page shows its error state instead of a 404.
 */
export async function fetchExploreDetail(slug: string): Promise<{ item: ApiExploreItem; type: ExploreType } | undefined> {
  const lookups = await Promise.allSettled([GetPlacesDetailsBySlugApi(slug), GetBusinessDetailsBySlugApi(slug)]);
  const types: ExploreType[] = ["place", "business"];
  for (const [i, lookup] of lookups.entries()) {
    const item: ApiExploreItem | undefined = lookup.status === "fulfilled" ? lookup.value?.data?.data : undefined;
    if (item) return { item, type: types[i] };
  }
  const failure = lookups.find((lookup) => lookup.status === "rejected" && !isNotFoundError(lookup.reason));
  if (failure?.status === "rejected") throw failure.reason;
  return undefined;
}
