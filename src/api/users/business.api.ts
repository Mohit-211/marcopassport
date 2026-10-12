import client from "../client";
import { Business } from "../endpoints";
import type { ListParams } from "./places.api";

export interface CreateBusinessPayload {
    business_name: string;
    contact_name: string;
    email: string;
    phone: string;
    website?: string;
    plan: string;
    message?: string;
}

export const CreateBusinesssApi = (payload: CreateBusinessPayload) =>
    client.post(Business.CREATE_BUSINESS, payload);

export const GetAllBusinessApi = (params?: ListParams) =>
    client.get(Business.GET_ALL_BUSINESS, { params });

export const GetBusinessDetailsBySlugApi = (slug: string) =>
    client.get(Business.GET_BUSINESS_DETAILS_BY_SLUG(slug));
