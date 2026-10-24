/**
 * The site-wide account dialog: login and sign-up, plus the forgot-password,
 * verify-email, reset-password and change-password steps. There are no
 * separate auth pages. A plain store rather than React context so the API
 * error handler (outside React) can open it on a 401 too.
 *
 * `requestLogin()` opens it on the login form and resolves `true` once the
 * user has logged in, or `false` if they close it. Callers that are already
 * waiting share the same dialog, so e.g. a 401 during a save and the
 * interceptor's own 401 handling don't stack two dialogs.
 */
export type AuthView =
  | "login"
  | "signup"
  | "forgot-password"
  | "verify-email"
  | "reset-password"
  | "change-password";

export const AUTH_VIEWS: readonly AuthView[] = [
  "login",
  "signup",
  "forgot-password",
  "verify-email",
  "reset-password",
  "change-password",
];

export interface LoginPopupState {
  open: boolean;
  view: AuthView;
  /** Shown above the form, e.g. why we're asking */
  message: string | null;
  /** The emailed token, for verify-email and reset-password */
  token: string | null;
  /** Carried between views, e.g. from the login form to forgot-password */
  email: string | null;
}

let state: LoginPopupState = { open: false, view: "login", message: null, token: null, email: null };
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
  set({ ...state, open: true, view: "login", message: message ?? state.message, token: null });
  return new Promise((resolve) => waiters.push(resolve));
}

/** Opens the dialog on a view, or switches to it: from an emailed link, the profile menu or another view. */
export function openAuthDialog(
  view: AuthView,
  options: { token?: string | null; email?: string | null; message?: string | null } = {},
) {
  set({
    open: true,
    view,
    message: options.message ?? null,
    token: options.token ?? null,
    email: options.email ?? state.email,
  });
}

/** Called by the dialog when it closes: after a login (true) or a dismissal (false). */
export function finishLogin(loggedIn: boolean) {
  const pending = waiters;
  waiters = [];
  set({ ...state, open: false, message: null, token: null, email: null });
  pending.forEach((resolve) => resolve(loggedIn));
}
