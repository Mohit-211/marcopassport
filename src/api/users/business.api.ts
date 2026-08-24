import client from "../client";
import { Business } from "../endpoints";

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
export const GetBusinessCategoryApi = () =>
    client.get(Business.BUSINESS_CATEGORIES);

export const GetAllBusinessApi = () =>
    client.get(Business.GET_ALL_BUSINESS);

export const GetAllBusinessByCategoryApi = (categorySlug: string) =>
    client.get(Business.GET_ALL_BUSINESS_BY_CATEGORIES_SLUG(categorySlug));

export const GetBusinessDetailsBySlugApi = (slug: string) =>
    client.get(Business.GET_BUSINESS_DETAILS_BY_SLUG(slug));
