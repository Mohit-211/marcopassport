"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/auth/PasswordField";
import { changePasswordApi } from "@/api/auth/auth.api";
import { getApiErrorMessage } from "@/errors/apiError";
import { setAuthToken } from "@/lib/auth";
import { PASSWORD_HINT, passwordProblem } from "@/lib/password";

type FieldErrors = {
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
};

/** Change password for a signed-in user, inside the account dialog (opened from the profile menu). */
export function ChangePasswordForm({ onDone }: { onDone: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const errors: FieldErrors = {
    currentPassword: currentPassword ? undefined : "Current password is required",
    password: passwordProblem(password),
    confirmPassword: !confirmPassword
      ? "Please confirm your new password"
      : confirmPassword !== password
        ? "Passwords do not match"
        : undefined,
  };
  const shown = (field: keyof FieldErrors) => (touched[field] ? errors[field] : undefined);
  const touch = (field: keyof FieldErrors) => () => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ currentPassword: true, password: true, confirmPassword: true });
    if (errors.currentPassword || errors.password || errors.confirmPassword) return;

    setLoading(true);
    setFormError(null);
    try {
      const res = await changePasswordApi({
        old_password: currentPassword,
        new_password: password,
        confirm_password: confirmPassword,
      });
      // The old token is revoked; the response carries its replacement.
      const token = res?.data?.data?.tokens?.access?.token;
      if (token) setAuthToken(token);
      toast.success("Password updated");
      onDone();
    } catch (err) {
      // A 401 (expired session) switches the dialog to the login step instead.
      if ((err as { response?: { status?: number } })?.response?.status !== 401) {
        setFormError(getApiErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-[1.65rem] font-semibold text-primary leading-tight">
        Change password
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
        Update the password for your account.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <PasswordField
          id="change-current"
          label="Current password"
          autoComplete="current-password"
          autoFocus
          value={currentPassword}
          onChange={setCurrentPassword}
          onBlur={touch("currentPassword")}
          error={shown("currentPassword")}
        />
        <PasswordField
          id="change-new"
          label="New password"
          value={password}
          onChange={setPassword}
          onBlur={touch("password")}
          error={shown("password")}
          hint={PASSWORD_HINT}
        />
        <PasswordField
          id="change-confirm"
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          onBlur={touch("confirmPassword")}
          error={shown("confirmPassword")}
        />

        {formError && (
          <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            {formError}
          </p>
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
            "Update password"
          )}
        </Button>
      </form>
    </div>
  );
}
