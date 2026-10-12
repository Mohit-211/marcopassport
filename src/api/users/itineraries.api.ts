import type { AxiosRequestConfig } from "axios";
import client from "../client";
import { Itineraries } from "../endpoints";
import type { Itinerary, ItineraryPayload } from "@/features/itineraries/types";

const unwrap = <T>(res: { data?: { data?: T } }) => res?.data?.data as T;

export const listItinerariesApi = async (config?: AxiosRequestConfig) => {
  const list = unwrap<Itinerary[]>(await client.get(Itineraries.LIST, config));
  return Array.isArray(list) ? list : [];
};

export const getItineraryApi = async (id: number | string) =>
  unwrap<Itinerary>(await client.get(Itineraries.DETAIL(id)));

export const createItineraryApi = async (payload: ItineraryPayload) =>
  unwrap<Itinerary>(await client.post(Itineraries.LIST, payload));

export const updateItineraryApi = async (id: number | string, payload: ItineraryPayload) =>
  unwrap<Itinerary>(await client.put(Itineraries.DETAIL(id), payload));

export const deleteItineraryApi = async (id: number | string) => {
  await client.delete(Itineraries.DETAIL(id));
};

export const addItineraryItemApi = async (
  id: number | string,
  item: { place_id: number; visit_date?: string | null },
) => unwrap<Itinerary>(await client.post(Itineraries.ITEMS(id), item));
