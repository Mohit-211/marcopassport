import { clearAuthToken, getAuthToken } from "../lib/auth";

export const handleApiError = (error) => {
  if (!error.response) {
    return Promise.reject(error);
  }

  const { status } = error.response;

  // Token is missing/invalid/expired server-side — sign the user out locally
  // so the UI (Navbar, Passport page, etc.) reflects the real auth state.
  if (status === 401 && getAuthToken()) {
    clearAuthToken();
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  }

  return Promise.reject(error);
};
