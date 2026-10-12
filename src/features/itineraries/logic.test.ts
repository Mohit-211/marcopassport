import { describe, expect, it } from "vitest";
import {
  draftProblem,
  emptyDraft,
  parseDraft,
  toPayload,
  withItemMoved,
  withItemRemoved,
  withPlaceAdded,
  withVisitDate,
} from "./logic";
import { MAX_ITINERARY_PLACES, type ItineraryDraft } from "./types";

const place = (id: number) => ({ id, name: `Place ${id}`, slug: `place-${id}`, address: "Main St" });

function draftWith(...ids: number[]): ItineraryDraft {
  return ids.reduce((draft, id) => {
    const result = withPlaceAdded(draft, place(id));
    if (!result.ok) throw new Error(result.reason);
    return result.draft;
  }, emptyDraft());
}

describe("withPlaceAdded", () => {
  it("appends places in order", () => {
    expect(draftWith(3, 1, 2).items.map((i) => i.place_id)).toEqual([3, 1, 2]);
  });

  it("rejects duplicates", () => {
    expect(withPlaceAdded(draftWith(1), place(1))).toEqual({ ok: false, reason: "duplicate" });
  });

  it("stops at the place limit", () => {
    const full = draftWith(...Array.from({ length: MAX_ITINERARY_PLACES }, (_, i) => i + 1));
    expect(withPlaceAdded(full, place(99))).toEqual({ ok: false, reason: "full" });
  });

  it("does not mutate the input", () => {
    const draft = draftWith(1);
    withPlaceAdded(draft, place(2));
    expect(draft.items).toHaveLength(1);
  });
});

describe("editing", () => {
  it("moves, removes and dates items", () => {
    let draft = draftWith(1, 2, 3);
    draft = withItemMoved(draft, 2, 0);
    expect(draft.items.map((i) => i.place_id)).toEqual([3, 1, 2]);
    draft = withItemMoved(draft, 0, 99);
    expect(draft.items.map((i) => i.place_id)).toEqual([1, 2, 3]);
    draft = withVisitDate(withItemRemoved(draft, 2), 3, "2026-12-02");
    expect(draft.items.map((i) => [i.place_id, i.visit_date])).toEqual([
      [1, null],
      [3, "2026-12-02"],
    ]);
  });
});

describe("toPayload", () => {
  it("sends only name, dates and place ids with visit dates", () => {
    const draft = withVisitDate({ ...draftWith(5), name: "  Trip  ", start_date: "" as never }, 5, "");
    expect(toPayload(draft)).toEqual({
      name: "Trip",
      start_date: null,
      end_date: null,
      items: [{ place_id: 5, visit_date: null }],
    });
  });
});

describe("draftProblem", () => {
  it("catches an empty name and reversed dates", () => {
    expect(draftProblem({ ...emptyDraft(), name: " " })).toMatch(/name/);
    expect(draftProblem({ ...emptyDraft(), start_date: "2026-12-05", end_date: "2026-12-01" })).toMatch(/end date/);
    expect(draftProblem(emptyDraft())).toBeNull();
  });
});

describe("parseDraft", () => {
  it("round-trips a draft", () => {
    const draft = draftWith(1, 2);
    expect(parseDraft(JSON.stringify(draft))).toEqual(draft);
  });

  it("drops malformed and duplicate items", () => {
    const raw = JSON.stringify({
      name: "x",
      start_date: "nope",
      items: [{ place_id: 1, place: place(1) }, { place_id: 1, place: place(1) }, { place_id: "bad" }, null],
    });
    const parsed = parseDraft(raw)!;
    expect(parsed.start_date).toBeNull();
    expect(parsed.items.map((i) => i.place_id)).toEqual([1]);
  });

  it("returns null for junk", () => {
    expect(parseDraft("{")).toBeNull();
    expect(parseDraft(null)).toBeNull();
    expect(parseDraft('"text"')).toBeNull();
  });
});
