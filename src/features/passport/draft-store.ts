import { STORAGE_KEYS, siteStorage as storage } from "@/lib/consent";
import { parseDraft } from "./logic";
import type { PassportDraft } from "./types";

/**
 * The guest's passport draft in localStorage (sessionStorage if the visitor
 * rejected cookies). It survives the login popup and the email-verification
 * round trip (the verify link opens in the same browser), and is saved to the
 * account right after login.
 */
const DRAFT_STORAGE_KEY = STORAGE_KEYS.draft;
const DRAFT_CHANGE_EVENT = "marcopassport:draft-change";
// Drafts saved before October 2026 used this key; they move over on first read.
const LEGACY_DRAFT_STORAGE_KEY = "mp_itinerary_draft";

// useSyncExternalStore needs the same object back while nothing changed.
let cachedRaw: string | null = null;
let cachedDraft: PassportDraft | null = null;

function moveLegacyDraft(store: Storage) {
  try {
    const legacy = store.getItem(LEGACY_DRAFT_STORAGE_KEY);
    if (legacy === null) return;
    if (store.getItem(DRAFT_STORAGE_KEY) === null) store.setItem(DRAFT_STORAGE_KEY, legacy);
    store.removeItem(LEGACY_DRAFT_STORAGE_KEY);
  } catch {
    // Blocked storage: nothing to move.
  }
}

export function readDraft(): PassportDraft | null {
  const store = storage();
  if (store) moveLegacyDraft(store);
  const raw = store?.getItem(DRAFT_STORAGE_KEY) ?? null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedDraft = parseDraft(raw);
  }
  return cachedDraft;
}

export function writeDraft(draft: PassportDraft) {
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
