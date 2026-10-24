"use client";

import { Suspense, useCallback, useEffect, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth/AuthForm";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { VerifyEmail } from "@/components/auth/VerifyEmail";
import { useAuth } from "@/hooks/useAuth";
import { getAuthToken } from "@/lib/auth";
import {
  AUTH_VIEWS,
  finishLogin,
  getLoginPopupState,
  openAuthDialog,
  requestLogin,
  subscribeLoginPopup,
  type AuthView,
  type LoginPopupState,
} from "@/lib/login-popup";

const closed: LoginPopupState = { open: false, view: "login", message: null, token: null, email: null };

const TITLES: Record<AuthView, string> = {
  login: "Log in or create an account",
  signup: "Create an account",
  "forgot-password": "Reset your password",
  "verify-email": "Verify your email",
  "reset-password": "Set a new password",
  "change-password": "Change your password",
};

const isAuthView = (value: string): value is AuthView => (AUTH_VIEWS as readonly string[]).includes(value);

/**
 * The site's only sign-in UI. Login, sign-up and every password and
 * verification step happen in this dialog, over whatever page is open, so
 * nothing the user was doing is lost. It's opened with `requestLogin()` or
 * `openAuthDialog()` from anywhere, and by emailed links (`?auth=<step>`).
 */
export function AuthDialog({ onLoggedIn }: { onLoggedIn: () => void | Promise<void> }) {
  const { open, view, message, token, email } = useSyncExternalStore(
    subscribeLoginPopup,
    getLoginPopupState,
    () => closed,
  );
  const { isAuthenticated } = useAuth();
  // Changing a password needs a session; signed out, it's the login step.
  const shown: AuthView = view === "change-password" && !isAuthenticated ? "login" : view;

  const completeLogin = useCallback(
    async (welcome: string) => {
      toast.success(welcome);
      // Resolve waiting callers (e.g. a passport save retrying after a 401) first.
      finishLogin(true);
      await onLoggedIn();
    },
    [onLoggedIn],
  );
  const handleVerified = useCallback(
    () => completeLogin("Your email is verified. Welcome aboard!"),
    [completeLogin],
  );

  return (
    <>
      <Suspense fallback={null}>
        <AuthLinkOpener />
      </Suspense>
      <Dialog open={open} onOpenChange={(next) => !next && finishLogin(false)}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-0 sm:max-w-[440px]">
          <DialogTitle className="sr-only">{TITLES[shown]}</DialogTitle>
          {open && (shown === "login" || shown === "signup") && (
            <AuthForm
              key={shown}
              initialMode={shown}
              initialEmail={email}
              message={message}
              onForgotPassword={(typed) => openAuthDialog("forgot-password", { email: typed })}
              onLoggedIn={() => completeLogin("Welcome back")}
            />
          )}
          {open && shown === "forgot-password" && (
            <ForgotPasswordForm
              initialEmail={email}
              onBackToLogin={(typed) => openAuthDialog("login", { email: typed })}
            />
          )}
          {open && shown === "verify-email" && (
            <VerifyEmail
              token={token ?? ""}
              onVerified={handleVerified}
              onLogIn={() => openAuthDialog("login")}
            />
          )}
          {open && shown === "reset-password" && (
            <ResetPasswordForm
              token={token ?? ""}
              onDone={() =>
                openAuthDialog("login", {
                  message: "Your password has been changed. Log in with your new password.",
                })
              }
              onRequestNewLink={() => openAuthDialog("forgot-password")}
            />
          )}
          {open && shown === "change-password" && <ChangePasswordForm onDone={() => finishLogin(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Opens the dialog from a URL: `?auth=<step>` on any page, with `&token=…`
 * from the verify and reset emails. Old auth pages redirect here too (see
 * next.config.ts). The parameters are removed once read, so a refresh or a
 * shared link doesn't reopen the dialog, and the token doesn't linger.
 */
function AuthLinkOpener() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const step = searchParams.get("auth");
    if (!step) return;
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const rest = new URLSearchParams(searchParams.toString());
    for (const key of ["auth", "token", "email", "redirect"]) rest.delete(key);
    const query = rest.toString();
    window.history.replaceState(null, "", `${pathname}${query ? `?${query}` : ""}${window.location.hash}`);

    if (!isAuthView(step) || step === "login") {
      void requestLogin();
    } else if (step === "change-password" && !getAuthToken()) {
      void requestLogin().then((loggedIn) => loggedIn && openAuthDialog("change-password"));
    } else {
      openAuthDialog(step, { token, email });
    }
  }, [searchParams, pathname]);

  return null;
}
