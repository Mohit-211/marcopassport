/**
 * The site-wide login popup. A plain store rather than React context so the
 * API error handler (outside React) can open it on a 401 too.
 *
 * `requestLogin()` opens the popup and resolves `true` once the user has
 * logged in, or `false` if they close it. Callers that are already waiting
 * share the same popup, so e.g. a 401 during a save and the interceptor's own
 * 401 handling don't stack two dialogs.
 */
export interface LoginPopupState {
  open: boolean;
  /** Shown above the form, e.g. why we're asking */
  message: string | null;
}

let state: LoginPopupState = { open: false, message: null };
let waiters: Array<(loggedIn: boolean) => void> = [];
const listeners = new Set<() => void>();

function set(next: LoginPopupState) {
  state = next;
  listeners.forEach((l) => l());
}

export function subscribeLoginPopup(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLoginPopupState() {
  return state;
}

export function requestLogin(message: string | null = null): Promise<boolean> {
  set({ open: true, message: message ?? state.message });
  return new Promise((resolve) => waiters.push(resolve));
}

/** Called by the popup when it closes: after a login (true) or a dismissal (false). */
export function finishLogin(loggedIn: boolean) {
  const pending = waiters;
  waiters = [];
  set({ open: false, message: null });
  pending.forEach((resolve) => resolve(loggedIn));
}
