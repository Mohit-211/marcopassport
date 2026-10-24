import { STORAGE_KEYS, siteStorage } from "./consent";

export const TOKEN_STORAGE_KEY = STORAGE_KEYS.token;
export const AUTH_CHANGE_EVENT = "marcopassport:auth-change";

// localStorage, or sessionStorage if the visitor rejected cookies (see consent.ts).
export function getAuthToken(): string | null {
  return siteStorage()?.getItem(TOKEN_STORAGE_KEY) ?? null;
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  siteStorage()?.setItem(TOKEN_STORAGE_KEY, token);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  siteStorage()?.removeItem(TOKEN_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
