"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  addItineraryItemApi,
  createItineraryApi,
  listItinerariesApi,
} from "@/api/users/itineraries.api";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { readDraft, subscribeDraft, writeDraft } from "./draft-store";
import { emptyDraft, hasPlace, withPlaceAdded } from "./logic";
import { savePendingDraft } from "./save-draft";
import {
  MAX_ITINERARY_PLACES,
  type Itinerary,
  type ItineraryDraft,
  type ItineraryPayload,
  type ItineraryPlace,
} from "./types";

interface ItinerariesContextValue {
  /** Auth state is known (false during SSR/hydration) */
  ready: boolean;
  isAuthenticated: boolean;

  /** The signed-in user's itineraries, newest-edited first; empty for guests */
  itineraries: Itinerary[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  /** Keep the list in sync after an itinerary page saves or deletes */
  upsertItinerary: (itinerary: Itinerary) => void;
  removeItinerary: (id: number) => void;

  /** The guest's local draft, or null if there is none */
  draft: ItineraryDraft | null;
  setDraft: (draft: ItineraryDraft) => void;

  /** "Added" state for a place: in any itinerary (signed in) or in the draft (guest) */
  isAdded: (placeId: number) => boolean;
  addToItinerary: (itineraryId: number, place: ItineraryPlace, visitDate?: string | null) => Promise<boolean>;
  createItinerary: (payload: ItineraryPayload) => Promise<Itinerary | null>;
  addToDraft: (place: ItineraryPlace, visitDate?: string | null) => boolean;

  /** Call right after a login succeeds: saves the guest draft, if any. */
  completeLogin: () => Promise<Itinerary | null>;
}

const ItinerariesContext = createContext<ItinerariesContextValue | null>(null);

const getServerDraft = () => null;

export function ItinerariesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, ready } = useAuth();
  const draft = useSyncExternalStore(subscribeDraft, readDraft, getServerDraft);

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const loadKey = `${isAuthenticated}:${reloadKey}`;
  const loading = ready && isAuthenticated && loadedFor !== loadKey;

  useEffect(() => {
    if (!ready || !isAuthenticated) return;
    let cancelled = false;
    // A background load: an expired token signs out quietly instead of popping the login dialog.
    listItinerariesApi({ skipGlobalError: true, skipLoginPopup: true })
      .then((list) => {
        if (cancelled) return;
        setItineraries(list);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setItineraries([]);
        setError("We couldn't load your itineraries. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoadedFor(loadKey);
      });
    return () => {
      cancelled = true;
    };
  }, [ready, isAuthenticated, loadKey]);

  const upsertItinerary = useCallback((itinerary: Itinerary) => {
    setItineraries((prev) => [itinerary, ...prev.filter((i) => i.id !== itinerary.id)]);
  }, []);

  const removeItinerary = useCallback((id: number) => {
    setItineraries((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const addToItinerary = useCallback<ItinerariesContextValue["addToItinerary"]>(
    async (itineraryId, place, visitDate = null) => {
      try {
        const itinerary = await addItineraryItemApi(itineraryId, {
          place_id: place.id,
          visit_date: visitDate || null,
        });
        upsertItinerary(itinerary);
        toast.success(`Added to ${itinerary.name}`, {
          description: place.name,
          action: { label: "Open", onClick: () => router.push(`/passport/${itinerary.id}`) },
        });
        return true;
      } catch {
        // The backend message (duplicate, full, ...) is shown by the global error popup.
        return false;
      }
    },
    [router, upsertItinerary],
  );

  const createItinerary = useCallback<ItinerariesContextValue["createItinerary"]>(
    async (payload) => {
      try {
        const itinerary = await createItineraryApi(payload);
        upsertItinerary(itinerary);
        return itinerary;
      } catch {
        return null;
      }
    },
    [upsertItinerary],
  );

  const addToDraft = useCallback<ItinerariesContextValue["addToDraft"]>(
    (place, visitDate = null) => {
      const result = withPlaceAdded(readDraft() ?? emptyDraft(), place, visitDate);
      if (!result.ok) {
        if (result.reason === "full") {
          toast.error(`An itinerary can have at most ${MAX_ITINERARY_PLACES} places.`);
        } else {
          toast.info("Already in your itinerary", { description: place.name });
        }
        return false;
      }
      writeDraft(result.draft);
      toast.success("Added to your itinerary", {
        description: "Log in from My Passport to save it to your account.",
        action: { label: "View", onClick: () => router.push("/passport") },
      });
      return true;
    },
    [router],
  );

  const completeLogin = useCallback(async () => {
    try {
      const saved = await savePendingDraft();
      if (saved) {
        upsertItinerary(saved);
        // The list may have loaded before the save landed; fetch it again.
        setReloadKey((k) => k + 1);
        toast.success("Your itinerary is saved", { description: saved.name });
      }
      return saved;
    } catch {
      // Draft kept; the error popup already shows why it couldn't be saved.
      return null;
    }
  }, [upsertItinerary]);

  const value = useMemo<ItinerariesContextValue>(
    () => ({
      ready,
      isAuthenticated,
      itineraries: isAuthenticated ? itineraries : [],
      loading,
      error: isAuthenticated ? error : null,
      reload: () => setReloadKey((k) => k + 1),
      upsertItinerary,
      removeItinerary,
      draft,
      setDraft: writeDraft,
      isAdded: (placeId) =>
        isAuthenticated
          ? itineraries.some((i) => hasPlace(i.items ?? [], placeId))
          : hasPlace(draft?.items ?? [], placeId),
      addToItinerary,
      createItinerary,
      addToDraft,
      completeLogin,
    }),
    [
      ready,
      isAuthenticated,
      itineraries,
      loading,
      error,
      upsertItinerary,
      removeItinerary,
      draft,
      addToItinerary,
      createItinerary,
      addToDraft,
      completeLogin,
    ],
  );

  return (
    <ItinerariesContext.Provider value={value}>
      {children}
      <AuthDialog
        onLoggedIn={async () => {
          const saved = await completeLogin();
          if (saved) router.push(`/passport/${saved.id}`);
        }}
      />
    </ItinerariesContext.Provider>
  );
}

export function useItineraries() {
  const ctx = useContext(ItinerariesContext);
  if (!ctx) throw new Error("useItineraries must be used inside <ItinerariesProvider>");
  return ctx;
}
