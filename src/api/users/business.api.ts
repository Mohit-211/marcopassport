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
    /** The form's free-text message; the backend stores it as additional_details. */
    additional_details?: string;
}

export const CreateBusinesssApi = (payload: CreateBusinessPayload) =>
    client.post(Business.CREATE_BUSINESS, payload);

export const GetAllBusinessApi = (params?: ListParams) =>
    client.get(Business.GET_ALL_BUSINESS, { params });

export const GetBusinessDetailsBySlugApi = (slug: string) =>
    client.get(Business.GET_BUSINESS_DETAILS_BY_SLUG(slug));
