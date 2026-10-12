"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { resetPasswordApi } from "@/api/auth/auth.api";
import { getApiErrorMessage } from "@/errors/apiError";
import { clearAuthToken } from "@/lib/auth";
import { requestLogin } from "@/lib/login-popup";
import { PASSWORD_HINT, passwordProblem } from "@/lib/password";

type FieldErrors = { password?: string; confirmPassword?: string };

const EXPIRED_PATTERN = /invalid|expired/i;

/**
 * /reset-password?token=… — opened from the reset email (valid 1 hour, single
 * use). Success signs the user out everywhere, so any stored token is cleared.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const errors: FieldErrors = {
    password: passwordProblem(password),
    confirmPassword: !confirmPassword
      ? "Please confirm your password"
      : confirmPassword !== password
        ? "Passwords do not match"
        : undefined,
  };

  const logIn = async () => {
    if (await requestLogin()) router.push("/passport");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (errors.password || errors.confirmPassword) return;

    setLoading(true);
    setFormError(null);
    try {
      await resetPasswordApi({ token, password, confirm_password: confirmPassword });
      clearAuthToken();
      setDone(true);
      void logIn();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!token || done) {
    return (
      <AuthCard>
        <div className="text-center">
          {done && (
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold">
              <CheckCircle2 className="h-6 w-6" />
            </span>
          )}
          <h1 className="mt-4 text-[1.65rem] font-semibold leading-tight text-primary">
            {done ? "Password changed" : "This link isn't valid"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {done
              ? "Please log in with your new password."
              : "The reset link is missing or incomplete. Request a new one below."}
          </p>
          {done ? (
            <Button variant="gold" size="lg" className="mt-6 w-full" onClick={logIn}>
              Log in
            </Button>
          ) : (
            <Link href="/auth/forgot-password" className="mt-6 block">
              <Button variant="gold" size="lg" className="w-full">
                Send a new link
              </Button>
            </Link>
          )}
        </div>
      </AuthCard>
    );
  }

  return (
    <>
      <AuthCard>
        <h1 className="text-[1.65rem] font-semibold text-primary leading-tight">
          Set a new password
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          Choose a new password for your account.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <PasswordField
            id="reset-password"
            label="New password"
            autoFocus
            value={password}
            onChange={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            error={touched.password ? errors.password : undefined}
            hint={PASSWORD_HINT}
          />
          <PasswordField
            id="reset-confirm"
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />

          {formError && (
            <div role="alert" className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {formError}
              {EXPIRED_PATTERN.test(formError) && (
                <>
                  {" "}
                  <Link href="/auth/forgot-password" className="font-medium underline underline-offset-4">
                    Send a new link
                  </Link>
                </>
              )}
            </div>
          )}

          <Button
            type="submit"
            variant="gold"
            size="lg"
            disabled={loading}
            className="w-full mt-2 shadow-gold"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating password…
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </AuthCard>

      <Link
        href="/auth"
        className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to log in
      </Link>
    </>
  );
}
