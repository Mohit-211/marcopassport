import client from "../client";
import { Place } from "../endpoints";
export const GetAllPlacesApi = () =>
    client.get(Place.GET_ALL_PLACES);
export const GetPlacesDetailsBySlugApi = (slug: string) =>
    client.get(Place.GET_PLACE_DETAILS(slug));