import { createItineraryApi } from "@/api/users/itineraries.api";
import { clearDraft, readDraft } from "./draft-store";
import { toPayload } from "./logic";
import type { Itinerary } from "./types";

/**
 * Runs right after every login (popup, /auth page or /verify-email): saves the
 * guest's draft to the account in one request. Resolves to the new itinerary,
 * or null when there was nothing to save. If the backend rejects the draft
 * (e.g. a place was unlisted meanwhile) the error is thrown, its message is
 * shown by the global error popup, and the draft is kept.
 */
export async function savePendingDraft(): Promise<Itinerary | null> {
  const draft = readDraft();
  if (!draft) return null;
  if (draft.items.length === 0) {
    clearDraft();
    return null;
  }
  const itinerary = await createItineraryApi(toPayload(draft));
  clearDraft();
  return itinerary;
}
