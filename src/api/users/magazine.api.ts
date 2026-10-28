import client from "../client";
import { Magazines } from "../endpoints";
import type { ApiMagazineIssue, ApiMagazineList } from "@/types/magazine";

const unwrap = <T>(res: { data?: { data?: T } }) => res?.data?.data as T;

/** Published issues, newest first; no auth needed. */
export const getMagazinesApi = async (params?: { page?: number; limit?: number }) =>
  unwrap<ApiMagazineList>(await client.get(Magazines.LIST, { params }));

/** One published issue with its pages; 404 for drafts and unknown slugs. */
export const getMagazineApi = async (slug: string) =>
  unwrap<ApiMagazineIssue>(await client.get(Magazines.DETAIL(slug)));
