/**
 * The visitor's cookie choice, and where the site keeps its own data on their
 * device. Nothing here is for ads or tracking: the only things stored are
 * the sign-in token, a guest's passport draft, the planner's panel width and
 * the choice itself (listed on /privacy#cookies).
 *
 * "essential" (or no choice yet) keeps them in localStorage, so they survive
 * closing the browser. "rejected" moves them to sessionStorage: the site still
 * works, but forgets the visitor when they close the tab. The choice itself
 * stays in localStorage either way, so the banner doesn't come back.
 */
export type CookieChoice = "essential" | "rejected";

/** Every key the site stores itself. */
export const STORAGE_KEYS = {
  token: "MarcoPassport",
  draft: "mp_passport_draft",
  plannerWidth: "planner-panel-width",
} as const;

const CHOICE_KEY = "mp_cookie_consent";
const CHANGE_EVENT = "marcopassport:consent-change";

function browserStorage(kind: "localStorage" | "sessionStorage"): Storage | null {
  try {
    return typeof window === "undefined" ? null : window[kind];
  } catch {
    // Storage blocked (e.g. some private modes): the site runs without it.
    return null;
  }
}

export function getCookieChoice(): CookieChoice | null {
  const value = browserStorage("localStorage")?.getItem(CHOICE_KEY);
  return value === "essential" || value === "rejected" ? value : null;
}

/** Where the site keeps its own data, given the visitor's choice. */
export function siteStorage(): Storage | null {
  return browserStorage(getCookieChoice() === "rejected" ? "sessionStorage" : "localStorage");
}

// Set by "Cookie settings" on the privacy page to show the banner again.
let settingsOpen = false;

function notify() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function setCookieChoice(choice: CookieChoice) {
  const from = browserStorage(choice === "rejected" ? "localStorage" : "sessionStorage");
  const to = browserStorage(choice === "rejected" ? "sessionStorage" : "localStorage");
  // Carry the sign-in and draft across, so answering doesn't sign anyone out.
  for (const key of Object.values(STORAGE_KEYS)) {
    const value = from?.getItem(key);
    if (value == null) continue;
    try {
      to?.setItem(key, value);
    } catch {
      // Storage full or blocked: this one just won't carry over.
    }
    from?.removeItem(key);
  }
  try {
    browserStorage("localStorage")?.setItem(CHOICE_KEY, choice);
  } catch {
    // Blocked: the banner will ask again next visit.
  }
  settingsOpen = false;
  notify();
}

export function openCookieSettings() {
  settingsOpen = true;
  notify();
}

export function shouldShowCookieBanner() {
  return settingsOpen || getCookieChoice() === null;
}

export function subscribeCookieChoice(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === CHOICE_KEY) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
