"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutApi } from "@/api/auth/auth.api";
import { UserProfileApi } from "@/api/users/users.api";
import { AUTH_CHANGE_EVENT, clearAuthToken, getAuthToken } from "@/lib/auth";

export interface AuthUser {
  id?: number;
  email?: string;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  /** The signed-in user's profile once it has loaded; null for guests */
  user: AuthUser | null;
  /** false during SSR and hydration, true once running on the client */
  ready: boolean;
  logout: () => Promise<void>;
  loggingOut: boolean;
}

function subscribeToAuth(onChange: () => void) {
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const noopSubscribe = () => () => {};

const AuthContext = createContext<AuthState | null>(null);

/**
 * Sign-in state for the whole site, so the profile is fetched once per
 * sign-in rather than by every component that needs to know who's signed in.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  // The token lives in browser storage, so the server snapshot is always "signed out"
  const token = useSyncExternalStore(subscribeToAuth, getAuthToken, () => null);
  const isAuthenticated = !!token;
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  // Kept with the token it was fetched for, so a new sign-in never shows the last user's details.
  const [profile, setProfile] = useState<{ token: string; user: AuthUser } | null>(null);
  const user = profile && profile.token === token ? profile.user : null;
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    UserProfileApi()
      .then((res) => {
        if (cancelled) return;
        const data = res?.data?.data ?? res?.data ?? null;
        // The API puts the name on the profile record: { id, email, user_profile: { name } }
        if (data) {
          setProfile({
            token,
            user: { id: data.id, email: data.email, name: data.user_profile?.name ?? data.name },
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [token]);

  const logout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutApi();
    } catch {
      // Token may already be invalid/expired server-side — clear locally regardless.
    } finally {
      clearAuthToken();
      setProfile(null);
      setLoggingOut(false);
      toast.success("Signed out");
      router.push("/auth");
    }
  }, [router, loggingOut]);

  const value = useMemo(
    () => ({ isAuthenticated, user, ready, logout, loggingOut }),
    [isAuthenticated, user, ready, logout, loggingOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside <AuthProvider>");
  return auth;
}
