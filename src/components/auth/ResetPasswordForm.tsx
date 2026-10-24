"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/auth/PasswordField";
import { resetPasswordApi } from "@/api/auth/auth.api";
import { getApiErrorMessage } from "@/errors/apiError";
import { clearAuthToken } from "@/lib/auth";
import { PASSWORD_HINT, passwordProblem } from "@/lib/password";

type FieldErrors = { password?: string; confirmPassword?: string };

const EXPIRED_PATTERN = /invalid|expired/i;

/**
 * Step 2 of the reset, inside the account dialog: opened from the reset email
 * (`?auth=reset-password&token=…`, valid 1 hour, single use). Success signs
 * the user out everywhere, so any stored token is cleared.
 */
export function ResetPasswordForm({
  token,
  onDone,
  onRequestNewLink,
}: {
  token: string;
  /** Called once the password is changed, to show the login step */
  onDone: () => void;
  /** Switches to forgot-password for a fresh link */
  onRequestNewLink: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const errors: FieldErrors = {
    password: passwordProblem(password),
    confirmPassword: !confirmPassword
      ? "Please confirm your password"
      : confirmPassword !== password
        ? "Passwords do not match"
        : undefined,
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
      onDone();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="p-6 text-center sm:p-8">
        <h2 className="text-[1.65rem] font-semibold leading-tight text-primary">
          This link isn&apos;t valid
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The reset link is missing or incomplete. Request a new one below.
        </p>
        <Button variant="gold" size="lg" className="mt-6 w-full" onClick={onRequestNewLink}>
          Send a new link
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-[1.65rem] font-semibold text-primary leading-tight">
        Set a new password
      </h2>
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
                <button
                  type="button"
                  onClick={onRequestNewLink}
                  className="font-medium underline underline-offset-4"
                >
                  Send a new link
                </button>
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
    </div>
  );
}
