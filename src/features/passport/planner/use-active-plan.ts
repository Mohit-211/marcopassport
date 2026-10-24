"use client";

import { useCallback, useState } from "react";
import { updatePassportApi } from "@/api/users/passports.api";
import { isAuthError } from "@/errors/apiError";
import { requestLogin } from "@/lib/login-popup";
import { emptyDraft, toDraft, toPayload } from "../logic";
import { usePassports } from "../PassportsProvider";
import type { PassportDraft } from "../types";

/**
 * The plan the "Plan my trip" modal edits. Guests edit their on-device draft
 * (saved instantly to localStorage, as everywhere else); signed-in users edit
 * one of their passports, saved to the API on each change. It's the same
 * data My Passport shows, not a separate store.
 */
export function useActivePlan() {
  const { isAuthenticated, passports, draft, setDraft, upsertPassport } = usePassports();
  const [pickedId, setPickedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // The picked passport, else the most recently edited one.
  const passport = isAuthenticated
    ? (passports.find((i) => i.id === pickedId) ?? passports[0] ?? null)
    : null;
  const value: PassportDraft | null = isAuthenticated
    ? passport && toDraft(passport)
    : (draft ?? emptyDraft());

  const save = useCallback(
    async (next: PassportDraft): Promise<boolean> => {
      if (!isAuthenticated) {
        setDraft(next);
        return true;
      }
      if (!passport) return false;
      setSaving(true);
      try {
        // A second try only after the session expired and they logged back in.
        // Other errors are shown by the global error popup.
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            upsertPassport(await updatePassportApi(passport.id, toPayload(next)));
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
    [isAuthenticated, passport, setDraft, upsertPassport],
  );

  return {
    value,
    save,
    saving,
    passport,
    passports: isAuthenticated ? passports : [],
    pick: setPickedId,
  };
}
