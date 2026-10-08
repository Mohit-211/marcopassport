export const TOKEN_STORAGE_KEY = "MarcoPassport";
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

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
