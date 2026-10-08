import { clearAuthToken, getAuthToken } from "../lib/auth";
import { isAuthError, showApiError } from "./apiError";

// Give the user a moment to read the "session expired" popup before leaving the page.
const AUTH_REDIRECT_DELAY = 1500;
let redirectingToAuth = false;

export const handleApiError = (error) => {
  showApiError(error);

  // Token is missing/invalid/expired server-side (401, "Token Not Found",
  // "Please authenticate"): sign the user out locally so the UI reflects the
  // real auth state, then send them to sign in. The /auth pages are skipped,
  // so a failed login just shows its error.
  if (isAuthError(error) && typeof window !== "undefined") {
    if (getAuthToken()) clearAuthToken();

    const { pathname, search } = window.location;
    if (!redirectingToAuth && !pathname.startsWith("/auth")) {
      redirectingToAuth = true;
      // Bring the user back to this page after they sign in.
      const redirect = encodeURIComponent(pathname + search);
      window.setTimeout(() => {
        window.location.href = `/auth?redirect=${redirect}`;
      }, AUTH_REDIRECT_DELAY);
    }
  }

  return Promise.reject(error);
};
