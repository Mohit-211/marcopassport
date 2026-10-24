"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  addPassportItemApi,
  createPassportApi,
  listPassportsApi,
  updatePassportApi,
} from "@/api/users/passports.api";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { readDraft, subscribeDraft, writeDraft } from "./draft-store";
import { emptyDraft, hasPlace, toDraft, toPayload, withItemRemoved, withPlaceAdded } from "./logic";
import { savePendingDraft } from "./save-draft";
import {
  MAX_PASSPORT_PLACES,
  type Passport,
  type PassportDraft,
  type PassportPayload,
  type PassportPlace,
} from "./types";

interface PassportsContextValue {
  /** Auth state is known (false during SSR/hydration) */
  ready: boolean;
  isAuthenticated: boolean;

  /** The signed-in user's passports, newest-edited first; empty for guests */
  passports: Passport[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  /** Keep the list in sync after a passport page saves or deletes */
  upsertPassport: (passport: Passport) => void;
  removePassport: (id: number) => void;

  /** The guest's local draft, or null if there is none */
  draft: PassportDraft | null;
  setDraft: (draft: PassportDraft) => void;

  /** "Added" state for a place: in any passport (signed in) or in the draft (guest) */
  isAdded: (placeId: number) => boolean;
  /** The signed-in user's passports that hold this place */
  passportsWith: (placeId: number) => Passport[];
  addToPassport: (passportId: number, place: PassportPlace, visitDate?: string | null) => Promise<boolean>;
  removeFromPassport: (passportId: number, place: PassportPlace) => Promise<boolean>;
  createPassport: (payload: PassportPayload) => Promise<Passport | null>;
  addToDraft: (place: PassportPlace, visitDate?: string | null) => boolean;
  removeFromDraft: (place: PassportPlace) => void;

  /** Call right after a login succeeds: saves the guest draft, if any. */
  completeLogin: () => Promise<Passport | null>;
}

const PassportsContext = createContext<PassportsContextValue | null>(null);

const getServerDraft = () => null;

/** Tabs tell each other here when a passport changes, so every tab shows the same thing. */
const SYNC_CHANNEL = "marcopassport:passports";
/** Coming back to a tab refreshes the list, at most this often. */
const REFRESH_ON_FOCUS_MS = 15_000;

export function PassportsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, ready } = useAuth();
  const draft = useSyncExternalStore(subscribeDraft, readDraft, getServerDraft);

  const [passports, setPassports] = useState<Passport[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  // A quiet refresh: the list updates in place, without the loading state.
  const [refreshKey, setRefreshKey] = useState(0);
  const lastRefresh = useRef(0);
  const channel = useRef<BroadcastChannel | null>(null);
  const loadKey = `${isAuthenticated}:${reloadKey}`;
  const loading = ready && isAuthenticated && loadedFor !== loadKey;

  useEffect(() => {
    if (!ready || !isAuthenticated) return;
    let cancelled = false;
    // A background load: an expired token signs out quietly instead of popping the login dialog.
    listPassportsApi({ skipGlobalError: true, skipLoginPopup: true })
      .then((list) => {
        if (cancelled) return;
        setPassports(list);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setPassports([]);
        setError("We couldn't load your passports. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoadedFor(loadKey);
        lastRefresh.current = Date.now();
      });
    return () => {
      cancelled = true;
    };
  }, [ready, isAuthenticated, loadKey]);

  useEffect(() => {
    if (!ready || !isAuthenticated || refreshKey === 0) return;
    let cancelled = false;
    lastRefresh.current = Date.now();
    listPassportsApi({ skipGlobalError: true, skipLoginPopup: true })
      .then((list) => {
        if (!cancelled) setPassports(list);
      })
      .catch(() => {
        // Keep what's shown; the next refresh tries again.
      });
    return () => {
      cancelled = true;
    };
  }, [ready, isAuthenticated, refreshKey]);

  // Changes made in another tab, or on another device while this tab was hidden.
  useEffect(() => {
    const refresh = () => setRefreshKey((k) => k + 1);
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - lastRefresh.current > REFRESH_ON_FOCUS_MS) refresh();
    };
    if (typeof BroadcastChannel !== "undefined") {
      channel.current = new BroadcastChannel(SYNC_CHANNEL);
      channel.current.onmessage = refresh;
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      channel.current?.close();
      channel.current = null;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const notifyOtherTabs = useCallback(() => channel.current?.postMessage("changed"), []);

  const upsertPassport = useCallback(
    (passport: Passport) => {
      setPassports((prev) => [passport, ...prev.filter((i) => i.id !== passport.id)]);
      notifyOtherTabs();
    },
    [notifyOtherTabs],
  );

  const removePassport = useCallback(
    (id: number) => {
      setPassports((prev) => prev.filter((i) => i.id !== id));
      notifyOtherTabs();
    },
    [notifyOtherTabs],
  );

  const addToPassport = useCallback<PassportsContextValue["addToPassport"]>(
    async (passportId, place, visitDate = null) => {
      try {
        const passport = await addPassportItemApi(passportId, {
          place_id: place.id,
          visit_date: visitDate || null,
        });
        upsertPassport(passport);
        toast.success(`Added to ${passport.name}`, {
          description: place.name,
          action: { label: "Open", onClick: () => router.push(`/passport/${passport.id}`) },
        });
        return true;
      } catch {
        // The backend message (duplicate, full, ...) is shown by the global error popup.
        return false;
      }
    },
    [router, upsertPassport],
  );

  const removeFromPassport = useCallback<PassportsContextValue["removeFromPassport"]>(
    async (passportId, place) => {
      const before = passports.find((p) => p.id === passportId);
      if (!before) return false;
      try {
        const passport = await updatePassportApi(passportId, toPayload(withItemRemoved(toDraft(before), place.id)));
        upsertPassport(passport);
        toast.success(`Removed from ${passport.name}`, {
          description: place.name,
          action: {
            label: "Undo",
            // Puts the passport back as it was: same order, same visit dates.
            onClick: () => void updatePassportApi(passportId, toPayload(toDraft(before))).then(upsertPassport, () => {}),
          },
        });
        return true;
      } catch {
        // Shown by the global error popup.
        return false;
      }
    },
    [passports, upsertPassport],
  );

  const createPassport = useCallback<PassportsContextValue["createPassport"]>(
    async (payload) => {
      try {
        const passport = await createPassportApi(payload);
        upsertPassport(passport);
        return passport;
      } catch {
        return null;
      }
    },
    [upsertPassport],
  );

  const addToDraft = useCallback<PassportsContextValue["addToDraft"]>(
    (place, visitDate = null) => {
      const result = withPlaceAdded(readDraft() ?? emptyDraft(), place, visitDate);
      if (!result.ok) {
        if (result.reason === "full") {
          toast.error(`A passport can have at most ${MAX_PASSPORT_PLACES} places.`);
        } else {
          toast.info("Already in your passport", { description: place.name });
        }
        return false;
      }
      writeDraft(result.draft);
      toast.success("Added to your passport", {
        description: "Log in from My Passport to save it to your account.",
        action: { label: "View", onClick: () => router.push("/passport") },
      });
      return true;
    },
    [router],
  );

  const removeFromDraft = useCallback((place: PassportPlace) => {
    const before = readDraft();
    if (!before) return;
    writeDraft(withItemRemoved(before, place.id));
    toast.success("Removed from your passport", {
      description: place.name,
      action: { label: "Undo", onClick: () => writeDraft(before) },
    });
  }, []);

  const completeLogin = useCallback(async () => {
    try {
      const saved = await savePendingDraft();
      if (saved) {
        upsertPassport(saved);
        // The list may have loaded before the save landed; fetch it again.
        setReloadKey((k) => k + 1);
        toast.success("Your passport is saved", { description: saved.name });
      }
      return saved;
    } catch {
      // Draft kept; the error popup already shows why it couldn't be saved.
      return null;
    }
  }, [upsertPassport]);

  const value = useMemo<PassportsContextValue>(
    () => ({
      ready,
      isAuthenticated,
      passports: isAuthenticated ? passports : [],
      loading,
      error: isAuthenticated ? error : null,
      reload: () => setReloadKey((k) => k + 1),
      upsertPassport,
      removePassport,
      draft,
      setDraft: writeDraft,
      isAdded: (placeId) =>
        isAuthenticated
          ? passports.some((i) => hasPlace(i.items ?? [], placeId))
          : hasPlace(draft?.items ?? [], placeId),
      passportsWith: (placeId) =>
        isAuthenticated ? passports.filter((i) => hasPlace(i.items ?? [], placeId)) : [],
      addToPassport,
      removeFromPassport,
      createPassport,
      addToDraft,
      removeFromDraft,
      completeLogin,
    }),
    [
      ready,
      isAuthenticated,
      passports,
      loading,
      error,
      upsertPassport,
      removePassport,
      draft,
      addToPassport,
      removeFromPassport,
      createPassport,
      addToDraft,
      removeFromDraft,
      completeLogin,
    ],
  );

  return (
    <PassportsContext.Provider value={value}>
      {children}
      <AuthDialog
        onLoggedIn={async () => {
          const saved = await completeLogin();
          if (saved) router.push(`/passport/${saved.id}`);
        }}
      />
    </PassportsContext.Provider>
  );
}

export function usePassports() {
  const ctx = useContext(PassportsContext);
  if (!ctx) throw new Error("usePassports must be used inside <PassportsProvider>");
  return ctx;
}
