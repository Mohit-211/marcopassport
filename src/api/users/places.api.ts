import client from "../client";
import { Place } from "../endpoints";

export type ListParams = { limit?: number; page?: number; featured?: boolean; category_id?: number };

export const GetAllPlacesApi = (params?: ListParams) =>
    client.get(Place.GET_ALL_PLACES, { params });
export const GetPlacesDetailsBySlugApi = (slug: string) =>
    client.get(Place.GET_PLACE_DETAILS(slug));
