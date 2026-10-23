import { STORAGE_KEYS, siteStorage } from "./consent";

export const TOKEN_STORAGE_KEY = STORAGE_KEYS.token;
export const AUTH_CHANGE_EVENT = "marcopassport:auth-change";
export const DEFAULT_AUTH_REDIRECT = "/passport";

/**
 * Only same-origin paths are allowed as a post-login redirect ("//host" and
 * "/\host" are protocol-relative URLs to another site). "/auth*" falls back to
 * the default so a signed-in user is never sent back to the sign-in page.
 */
export function getSafeRedirect(target: string | null | undefined): string {
  if (
    !target ||
    !target.startsWith("/") ||
    target.startsWith("//") ||
    target.startsWith("/\\") ||
    target.startsWith("/auth")
  ) {
    return DEFAULT_AUTH_REDIRECT;
  }
  return target;
}

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
