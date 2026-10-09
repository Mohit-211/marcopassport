import { GetAllPlacesApi } from "@/api/users/places.api";
import { GetAllBusinessApi } from "@/api/users/business.api";
import { normalizeBusiness, normalizeList, normalizePlace } from "../normalize";
import type { NormalizedItem } from "../types";

export interface ItemsResult {
  items: NormalizedItem[];
  /** Which sources failed to load; the other source's items are still returned */
  failed: Array<"places" | "business">;
}

/** Loads places and businesses together and returns them in the common model. */
export async function fetchAllItems(): Promise<ItemsResult> {
  const [places, businesses] = await Promise.allSettled([
    GetAllPlacesApi(),
    GetAllBusinessApi(),
  ]);

  const failed: ItemsResult["failed"] = [];
  const items: NormalizedItem[] = [];

  if (places.status === "fulfilled") {
    items.push(...normalizeList(places.value?.data?.data?.places, normalizePlace));
  } else {
    failed.push("places");
  }
  if (businesses.status === "fulfilled") {
    items.push(...normalizeList(businesses.value?.data?.data?.places, normalizeBusiness));
  } else {
    failed.push("business");
  }

  if (failed.length === 2) throw new Error("Couldn't load places or businesses");
  return { items, failed };
}
