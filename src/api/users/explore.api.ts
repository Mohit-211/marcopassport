import { GetAllBusinessApi } from "./business.api";
import { GetAllPlacesApi, type ListParams } from "./places.api";
import type { ApiBusiness } from "@/types/business";
import type { ApiPlace } from "@/types/place";
import { toExploreItem, type ExploreItem, type ExploreType } from "@/lib/explore";

// The list endpoints page at 15 by default. Explore filters on the client, so
// it asks for everything in one go (see the backend note about a combined,
// server-filtered endpoint).
const ALL = 500;

export interface ExploreResult {
  items: ExploreItem[];
  /** Which list failed to load; the other one is still shown */
  failed: ExploreType[];
}

/** Places to visit and businesses from their two endpoints, in one list. */
export async function fetchExploreItems(params: ListParams = { limit: ALL }): Promise<ExploreResult> {
  const [places, businesses] = await Promise.allSettled([
    GetAllPlacesApi(params),
    GetAllBusinessApi(params),
  ]);
  const items: ExploreItem[] = [];
  const failed: ExploreType[] = [];
  if (places.status === "fulfilled") {
    items.push(...((places.value?.data?.data?.places ?? []) as ApiPlace[]).map((p) => toExploreItem(p, "place")));
  } else {
    failed.push("place");
  }
  if (businesses.status === "fulfilled") {
    items.push(...((businesses.value?.data?.data?.places ?? []) as ApiBusiness[]).map((b) =>
      toExploreItem(b, "business"),
    ));
  } else {
    failed.push("business");
  }
  if (failed.length === 2) throw new Error("Couldn't load listings");
  return { items, failed };
}
