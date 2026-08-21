import client from "../client";
import { Passport } from "../endpoints";

export const AddtoPassportApi = (payload: { place_id: number; visit_date: string }) =>
    client.post(Passport.ADD_TO_PASSPORT, payload);

export const UpdatePassportApi = (id: number | string, payload: { visit_date: string }) =>
    client.put(Passport.UPDATE_PASSPORT(id), payload);