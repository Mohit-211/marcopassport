import client from "../client";
import { Newsletter } from "../endpoints";

export type NewsletterSource = "footer" | "blog";

/** Saves the email for when a mailing service is connected; signing up twice is fine. */
export const SubscribeNewsletterApi = (payload: { email: string; source: NewsletterSource }) =>
    client.post(Newsletter.SUBSCRIBE, payload);
