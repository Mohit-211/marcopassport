import {
  DEFAULT_ITINERARY_NAME,
  MAX_ITINERARY_PLACES,
  type ItineraryDraft,
  type ItineraryItem,
  type ItineraryPayload,
  type ItineraryPlace,
} from "./types";

/**
 * Pure itinerary edits shared by the guest draft and saved itineraries. They
 * never mutate their input, so they are safe to use directly on React state.
 */

export type AddResult =
  | { ok: true; draft: ItineraryDraft }
  | { ok: false; reason: "duplicate" | "full" };

export function emptyDraft(): ItineraryDraft {
  return { name: DEFAULT_ITINERARY_NAME, start_date: null, end_date: null, items: [] };
}

export function hasPlace(items: ItineraryItem[], placeId: number) {
  return items.some((item) => item.place_id === placeId);
}

/** Appends a place, enforcing the backend's no-duplicates and 20-place rules. */
export function withPlaceAdded(
  draft: ItineraryDraft,
  place: ItineraryPlace,
  visitDate: string | null = null,
): AddResult {
  if (hasPlace(draft.items, place.id)) return { ok: false, reason: "duplicate" };
  if (draft.items.length >= MAX_ITINERARY_PLACES) return { ok: false, reason: "full" };
  return {
    ok: true,
    draft: { ...draft, items: [...draft.items, { place_id: place.id, visit_date: visitDate || null, place }] },
  };
}

export function withItemRemoved(draft: ItineraryDraft, placeId: number): ItineraryDraft {
  return { ...draft, items: draft.items.filter((item) => item.place_id !== placeId) };
}

/** Moves the item at `from` to index `to` (both clamped to the list). */
export function withItemMoved(draft: ItineraryDraft, from: number, to: number): ItineraryDraft {
  const items = [...draft.items];
  if (from < 0 || from >= items.length) return draft;
  const target = Math.max(0, Math.min(to, items.length - 1));
  if (target === from) return draft;
  const [moved] = items.splice(from, 1);
  items.splice(target, 0, moved);
  return { ...draft, items };
}

export function withVisitDate(draft: ItineraryDraft, placeId: number, date: string | null): ItineraryDraft {
  return {
    ...draft,
    items: draft.items.map((item) =>
      item.place_id === placeId ? { ...item, visit_date: date || null } : item,
    ),
  };
}

/** Client-side check before Save; the backend validates again. */
export function draftProblem(draft: ItineraryDraft): string | null {
  if (!draft.name.trim()) return "Give your itinerary a name.";
  if (draft.start_date && draft.end_date && draft.end_date < draft.start_date) {
    return "The end date can't be before the start date.";
  }
  return null;
}

/** Only the fields the API accepts: name, dates and items[{ place_id, visit_date }]. */
export function toPayload(draft: ItineraryDraft): ItineraryPayload {
  return {
    name: draft.name.trim() || DEFAULT_ITINERARY_NAME,
    start_date: draft.start_date || null,
    end_date: draft.end_date || null,
    items: draft.items.map((item) => ({ place_id: item.place_id, visit_date: item.visit_date || null })),
  };
}

export function toDraft(itinerary: ItineraryDraft): ItineraryDraft {
  return {
    name: itinerary.name,
    start_date: itinerary.start_date,
    end_date: itinerary.end_date,
    items: itinerary.items,
  };
}

/** True when two drafts would save the same thing (used for "unsaved changes"). */
export function sameDraft(a: ItineraryDraft, b: ItineraryDraft) {
  return JSON.stringify(toPayload(a)) === JSON.stringify(toPayload(b));
}

/** Parses a stored draft, dropping anything malformed. */
export function parseDraft(raw: string | null): ItineraryDraft | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || !Array.isArray(value.items)) return null;
    const date = (d: unknown) => (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null);
    const seen = new Set<number>();
    const items: ItineraryItem[] = [];
    for (const item of value.items) {
      const id = Number(item?.place_id);
      if (!Number.isInteger(id) || id <= 0 || seen.has(id) || typeof item?.place?.name !== "string") continue;
      seen.add(id);
      items.push({ place_id: id, visit_date: date(item.visit_date), place: { ...item.place, id } });
    }
    return {
      name: typeof value.name === "string" ? value.name : DEFAULT_ITINERARY_NAME,
      start_date: date(value.start_date),
      end_date: date(value.end_date),
      items: items.slice(0, MAX_ITINERARY_PLACES),
    };
  } catch {
    return null;
  }
}
