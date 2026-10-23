import client from "../client";
import { Contact } from "../endpoints";

export interface ContactMessagePayload {
    name: string;
    email: string;
    subject?: string;
    message: string;
}

export const SendContactMessageApi = (payload: ContactMessagePayload) =>
    client.post(Contact.SEND_MESSAGE, payload);
