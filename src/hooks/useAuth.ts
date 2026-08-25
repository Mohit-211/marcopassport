"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutApi } from "@/api/auth/auth.api";
import { UserProfileApi } from "@/api/users/users.api";
import { AUTH_CHANGE_EVENT, clearAuthToken, getAuthToken } from "@/lib/auth";

interface AuthUser {
  email?: string;
  name?: string;
}

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const syncFromStorage = useCallback(() => {
    const token = getAuthToken();
    setIsAuthenticated(!!token);
    if (!token) setUser(null);
    setReady(true);
  }, []);

  useEffect(() => {
    syncFromStorage();
    window.addEventListener(AUTH_CHANGE_EVENT, syncFromStorage);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [syncFromStorage]);

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
      setIsAuthenticated(false);
      setLoggingOut(false);
      toast.success("Signed out");
      router.push("/auth");
    }
  }, [router, loggingOut]);

  return { isAuthenticated, user, ready, logout, loggingOut };
}
