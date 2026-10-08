import axios from "axios";
import { toast } from "sonner";
import { getAuthToken } from "../lib/auth";
import errorMessages, { statusMessages } from "./errorMessages";

// Backend wording for a missing/invalid token — not meant for end users.
const AUTH_MESSAGE_PATTERN = /token\s*not\s*found|please\s*authenticate/i;

declare module "axios" {
  interface AxiosRequestConfig {
    /**
     * Opt a single request out of the global error popup when the caller
     * handles the failure itself, e.g. `client.get(url, { skipGlobalError: true })`.
     */
    skipGlobalError?: boolean;
  }
}

const TOAST_DURATION = 5000;
// The same message is not shown again while it is still on screen.
const DEDUPE_WINDOW = TOAST_DURATION;
// More than this many distinct errors inside the burst window collapse into one popup.
const BURST_LIMIT = 3;
const BURST_WINDOW = 2000;
const BURST_TOAST_ID = "api-error:burst";

const SHOWN_FLAG = "__globalErrorShown";

type ErrorLike = {
  message?: unknown;
  code?: unknown;
  config?: { skipGlobalError?: boolean };
  response?: { status?: number; data?: unknown };
  [SHOWN_FLAG]?: boolean;
};

const recentMessages = new Map<string, number>();
let burstTimestamps: number[] = [];

function asErrorLike(error: unknown): ErrorLike | null {
  return typeof error === "object" && error !== null ? (error as ErrorLike) : null;
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getStatus(error: unknown): number | undefined {
  return asErrorLike(error)?.response?.status;
}

/** Picks the most useful message: backend message → backend error → error.message → status fallback → generic. */
export function getApiErrorMessage(error: unknown): string {
  const err = asErrorLike(error);
  if (!err) return nonEmptyString(error) ?? errorMessages.UNKNOWN;

  const data = err.response?.data;
  if (data && typeof data === "object") {
    const body = data as { message?: unknown; error?: unknown };
    const fromBody =
      nonEmptyString(body.message) ??
      nonEmptyString(body.error) ??
      nonEmptyString((body.error as { message?: unknown } | undefined)?.message);
    if (fromBody && AUTH_MESSAGE_PATTERN.test(fromBody)) {
      return getAuthToken()
        ? statusMessages[401]
        : errorMessages.LOGIN_REQUIRED;
    }
    if (fromBody) return fromBody;
  }

  const status = err.response?.status;

  if (axios.isAxiosError(error)) {
    // No response at all: offline, DNS, CORS, timeout, server unreachable.
    if (!err.response) return errorMessages.NETWORK_ERROR;
    // Axios' own "Request failed with status code 500" is not user-friendly.
    if (status && status in statusMessages) {
      return statusMessages[status as keyof typeof statusMessages];
    }
    return status && status >= 500
      ? statusMessages[500]
      : errorMessages.UNKNOWN;
  }

  const ownMessage = nonEmptyString(err.message);
  if (ownMessage) return ownMessage;

  if (status && status in statusMessages) {
    return statusMessages[status as keyof typeof statusMessages];
  }
  return errorMessages.UNKNOWN;
}

/** True for 401s and backend "Token Not Found" / "Please authenticate" responses. */
export function isAuthError(error: unknown): boolean {
  if (getStatus(error) === 401) return true;
  const data = asErrorLike(error)?.response?.data as { message?: unknown } | undefined;
  // console.log(data,"data===")
  return AUTH_MESSAGE_PATTERN.test(nonEmptyString(data?.message) ?? "");
}

function isCancelled(error: unknown): boolean {
  if (axios.isCancel(error)) return true;
  const err = asErrorLike(error);
  return (
    err?.code === "ERR_CANCELED" ||
    (error instanceof Error && error.name === "AbortError")
  );
}

function shouldShow(error: unknown): boolean {
  if (typeof window === "undefined") return false; // server components / SSR
  if (isCancelled(error)) return false;
  const err = asErrorLike(error);
  if (err?.config?.skipGlobalError) return false;
  if (err?.[SHOWN_FLAG]) return false;
  return true;
}

/**
 * Shows the shared error popup for a failed request. Every request made through
 * `@/api/client` already calls this from its response interceptor; call it
 * directly only for requests that bypass that client.
 */
export function showApiError(error: unknown): void {
  if (!shouldShow(error)) return;

  const err = asErrorLike(error);
  if (err) err[SHOWN_FLAG] = true;

  const message = getApiErrorMessage(error);
  const now = Date.now();

  for (const [msg, shownAt] of recentMessages) {
    if (now - shownAt >= DEDUPE_WINDOW) recentMessages.delete(msg);
  }
  const lastShown = recentMessages.get(message);
  if (lastShown && now - lastShown < DEDUPE_WINDOW) return;
  recentMessages.set(message, now);

  burstTimestamps = burstTimestamps.filter((t) => now - t < BURST_WINDOW);
  burstTimestamps.push(now);

  if (burstTimestamps.length > BURST_LIMIT) {
    toast.error("Several requests failed. Please try again in a moment.", {
      id: BURST_TOAST_ID,
      duration: TOAST_DURATION,
    });
    return;
  }

  toast.error(message, {
    id: `api-error:${message}`,
    duration: TOAST_DURATION,
  });
}
