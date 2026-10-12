import { parseDraft } from "./logic";
import type { ItineraryDraft } from "./types";

/**
 * The guest's itinerary draft in localStorage. It survives the login popup and
 * the email-verification round trip (the verify link opens in the same
 * browser), and is saved to the account right after login.
 */
export const DRAFT_STORAGE_KEY = "mp_itinerary_draft";
const DRAFT_CHANGE_EVENT = "marcopassport:draft-change";

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

// useSyncExternalStore needs the same object back while nothing changed.
let cachedRaw: string | null = null;
let cachedDraft: ItineraryDraft | null = null;

export function readDraft(): ItineraryDraft | null {
  const raw = storage()?.getItem(DRAFT_STORAGE_KEY) ?? null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedDraft = parseDraft(raw);
  }
  return cachedDraft;
}

export function writeDraft(draft: ItineraryDraft) {
  try {
    storage()?.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Storage full or blocked: the draft just won't persist.
  }
  window.dispatchEvent(new Event(DRAFT_CHANGE_EVENT));
}

export function clearDraft() {
  storage()?.removeItem(DRAFT_STORAGE_KEY);
  window.dispatchEvent(new Event(DRAFT_CHANGE_EVENT));
}

export function subscribeDraft(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === DRAFT_STORAGE_KEY) onChange();
  };
  window.addEventListener(DRAFT_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(DRAFT_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
