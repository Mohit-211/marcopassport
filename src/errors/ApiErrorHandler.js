import { clearAuthToken, getAuthToken } from "../lib/auth";
import { requestLogin } from "../lib/login-popup";
import { isAuthError, showApiError } from "./apiError";

const SESSION_EXPIRED = "Your session has expired. Please log in again.";

// Auth routes that don't need a token (or, for logout, where a 401 is moot):
// they report their own errors instead of opening the login popup.
const PUBLIC_AUTH_ROUTE =
  /user\/auth\/(login|register|verify-email|resend-verification|forgot-password|reset-password|logout)/;

export const handleApiError = (error) => {
  // A 401 on a user route means the token expired or was revoked: sign out
  // locally and open the login popup on top of the current page, so whatever
  // the user was doing (e.g. editing a passport) is still there afterwards.
  const config = error?.config ?? {};
  if (
    isAuthError(error) &&
    typeof window !== "undefined" &&
    !PUBLIC_AUTH_ROUTE.test(String(config.url ?? ""))
  ) {
    const hadToken = Boolean(getAuthToken());
    if (hadToken) clearAuthToken();
    if (!config.skipLoginPopup) void requestLogin(hadToken ? SESSION_EXPIRED : null);
    return Promise.reject(error);
  }

  showApiError(error);
  return Promise.reject(error);
};
