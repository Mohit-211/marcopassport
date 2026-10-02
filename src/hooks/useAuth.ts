"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutApi } from "@/api/auth/auth.api";
import { UserProfileApi } from "@/api/users/users.api";
import { AUTH_CHANGE_EVENT, clearAuthToken, getAuthToken } from "@/lib/auth";

interface AuthUser {
  email?: string;
  name?: string;
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

export function useAuth() {
  const router = useRouter();
  // Token lives in localStorage, so the server snapshot is always "signed out"
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    () => !!getAuthToken(),
    () => false,
  );
  // false during SSR and hydration, true once running on the client
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [profile, setUser] = useState<AuthUser | null>(null);
  const user = isAuthenticated ? profile : null;
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    UserProfileApi()
      .then((res) => {
        if (cancelled) return;
        const data = res?.data?.data ?? res?.data ?? null;
        if (data) setUser({ email: data.email, name: data.name });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const logout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutApi();
    } catch {
      // Token may already be invalid/expired server-side — clear locally regardless.
    } finally {
      clearAuthToken();
      setUser(null);
      setLoggingOut(false);
      toast.success("Signed out");
      router.push("/auth");
    }
  }, [router, loggingOut]);

  return { isAuthenticated, user, ready, logout, loggingOut };
}
