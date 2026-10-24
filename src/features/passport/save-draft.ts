import { createPassportApi } from "@/api/users/passports.api";
import { clearDraft, readDraft } from "./draft-store";
import { toPayload } from "./logic";
import type { Passport } from "./types";

/**
 * Runs right after every login (login or verify-email dialog): saves the
 * guest's draft to the account in one request. Resolves to the new passport,
 * or null when there was nothing to save. If the backend rejects the draft
 * (e.g. a place was unlisted meanwhile) the error is thrown, its message is
 * shown by the global error popup, and the draft is kept.
 */
export async function savePendingDraft(): Promise<Passport | null> {
  const draft = readDraft();
  if (!draft) return null;
  const payload = toPayload(draft);
  // Nothing to save.
  if (!payload.items?.length) {
    clearDraft();
    return null;
  }
  const passport = await createPassportApi(payload);
  clearDraft();
  return passport;
}
