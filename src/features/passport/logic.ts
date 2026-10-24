import {
  DEFAULT_PASSPORT_NAME,
  MAX_PASSPORT_PLACES,
  type PassportDraft,
  type PassportItem,
  type PassportPayload,
  type PassportPlace,
} from "./types";

/**
 * Pure passport edits shared by the guest draft and saved passports. They
 * never mutate their input, so they are safe to use directly on React state.
 */

export type AddResult =
  | { ok: true; draft: PassportDraft }
  | { ok: false; reason: "duplicate" | "full" };

export function emptyDraft(): PassportDraft {
  return { name: DEFAULT_PASSPORT_NAME, start_date: null, end_date: null, items: [] };
}

export function hasPlace(items: PassportItem[], placeId: number) {
  return items.some((item) => item.place_id === placeId);
}

/** Appends a place, enforcing the backend's no-duplicates and 20-place rules. */
export function withPlaceAdded(
  draft: PassportDraft,
  place: PassportPlace,
  visitDate: string | null = null,
): AddResult {
  if (hasPlace(draft.items, place.id)) return { ok: false, reason: "duplicate" };
  if (draft.items.length >= MAX_PASSPORT_PLACES) return { ok: false, reason: "full" };
  return {
    ok: true,
    draft: { ...draft, items: [...draft.items, { place_id: place.id, visit_date: visitDate || null, place }] },
  };
}

export function withItemRemoved(draft: PassportDraft, placeId: number): PassportDraft {
  return { ...draft, items: draft.items.filter((item) => item.place_id !== placeId) };
}

/** Moves the item at `from` to index `to` (both clamped to the list). */
export function withItemMoved(draft: PassportDraft, from: number, to: number): PassportDraft {
  const items = [...draft.items];
  if (from < 0 || from >= items.length) return draft;
  const target = Math.max(0, Math.min(to, items.length - 1));
  if (target === from) return draft;
  const [moved] = items.splice(from, 1);
  items.splice(target, 0, moved);
  return { ...draft, items };
}

export function withVisitDate(draft: PassportDraft, placeId: number, date: string | null): PassportDraft {
  return {
    ...draft,
    items: draft.items.map((item) =>
      item.place_id === placeId ? { ...item, visit_date: date || null } : item,
    ),
  };
}

/** Client-side check before Save; the backend validates again. */
export function draftProblem(draft: PassportDraft): string | null {
  if (!draft.name.trim()) return "Give your passport a name.";
  if (draft.start_date && draft.end_date && draft.end_date < draft.start_date) {
    return "The end date can't be before the start date.";
  }
  return null;
}

/**
 * Only the fields the API accepts: name, dates and items[{ place_id, visit_date }].
 */
export function toPayload(draft: PassportDraft): PassportPayload {
  return {
    name: draft.name.trim() || DEFAULT_PASSPORT_NAME,
    start_date: draft.start_date || null,
    end_date: draft.end_date || null,
    items: draft.items.map((item) => ({ place_id: item.place_id, visit_date: item.visit_date || null })),
  };
}

export function toDraft(passport: PassportDraft): PassportDraft {
  return {
    name: passport.name,
    start_date: passport.start_date,
    end_date: passport.end_date,
    items: passport.items,
  };
}

/** True when two drafts would save the same thing (used for "unsaved changes"). */
export function sameDraft(a: PassportDraft, b: PassportDraft) {
  return JSON.stringify(toPayload(a)) === JSON.stringify(toPayload(b));
}

/** Parses a stored draft, dropping anything malformed. */
export function parseDraft(raw: string | null): PassportDraft | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || !Array.isArray(value.items)) return null;
    const date = (d: unknown) => (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null);
    const seen = new Set<number>();
    const items: PassportItem[] = [];
    for (const item of value.items) {
      const id = Number(item?.place_id);
      const validId = Number.isInteger(id) && id > 0;
      if (!validId || seen.has(id) || typeof item?.place?.name !== "string") continue;
      seen.add(id);
      items.push({ place_id: id, visit_date: date(item.visit_date), place: { ...item.place, id } });
    }
    return {
      name: typeof value.name === "string" ? value.name : DEFAULT_PASSPORT_NAME,
      start_date: date(value.start_date),
      end_date: date(value.end_date),
      items: items.slice(0, MAX_PASSPORT_PLACES),
    };
  } catch {
    return null;
  }
}
