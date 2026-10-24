import type { AxiosRequestConfig } from "axios";
import client from "../client";
import { Passports } from "../endpoints";
import type { Passport, PassportPayload } from "@/features/passport/types";

const unwrap = <T>(res: { data?: { data?: T } }) => res?.data?.data as T;

export const listPassportsApi = async (config?: AxiosRequestConfig) => {
  const list = unwrap<Passport[]>(await client.get(Passports.LIST, config));
  return Array.isArray(list) ? list : [];
};

export const getPassportApi = async (id: number | string) =>
  unwrap<Passport>(await client.get(Passports.DETAIL(id)));

export const createPassportApi = async (payload: PassportPayload) =>
  unwrap<Passport>(await client.post(Passports.LIST, payload));

export const updatePassportApi = async (id: number | string, payload: PassportPayload) =>
  unwrap<Passport>(await client.put(Passports.DETAIL(id), payload));

export const deletePassportApi = async (id: number | string) => {
  await client.delete(Passports.DETAIL(id));
};

export const addPassportItemApi = async (
  id: number | string,
  item: { place_id: number; visit_date?: string | null },
) => unwrap<Passport>(await client.post(Passports.ITEMS(id), item));
