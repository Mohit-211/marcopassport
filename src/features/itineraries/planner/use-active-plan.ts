"use client";

import { useCallback, useState } from "react";
import { updateItineraryApi } from "@/api/users/itineraries.api";
import { isAuthError } from "@/errors/apiError";
import { requestLogin } from "@/lib/login-popup";
import { emptyDraft, toDraft, toPayload } from "../logic";
import { useItineraries } from "../ItinerariesProvider";
import type { ItineraryDraft } from "../types";

/**
 * The plan the "Plan my trip" modal edits. Guests edit their on-device draft
 * (saved instantly to localStorage, as everywhere else); signed-in users edit
 * one of their itineraries, saved to the API on each change. It's the same
 * data My Passport shows, not a separate store.
 */
export function useActivePlan() {
  const { isAuthenticated, itineraries, draft, setDraft, upsertItinerary } = useItineraries();
  const [pickedId, setPickedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // The picked itinerary, else the most recently edited one.
  const itinerary = isAuthenticated
    ? (itineraries.find((i) => i.id === pickedId) ?? itineraries[0] ?? null)
    : null;
  const value: ItineraryDraft | null = isAuthenticated
    ? itinerary && toDraft(itinerary)
    : (draft ?? emptyDraft());

  const save = useCallback(
    async (next: ItineraryDraft): Promise<boolean> => {
      if (!isAuthenticated) {
        setDraft(next);
        return true;
      }
      if (!itinerary) return false;
      setSaving(true);
      try {
        // A second try only after the session expired and they logged back in.
        // Other errors are shown by the global error popup.
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            upsertItinerary(await updateItineraryApi(itinerary.id, toPayload(next)));
            return true;
          } catch (error) {
            if (attempt > 0 || !isAuthError(error) || !(await requestLogin())) return false;
          }
        }
        return false;
      } finally {
        setSaving(false);
      }
    },
    [isAuthenticated, itinerary, setDraft, upsertItinerary],
  );

  return {
    value,
    save,
    saving,
    itinerary,
    itineraries: isAuthenticated ? itineraries : [],
    pick: setPickedId,
  };
}
