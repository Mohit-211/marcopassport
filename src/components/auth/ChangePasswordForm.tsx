"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/auth/PasswordField";
import { changePasswordApi } from "@/api/auth/auth.api";
import { getApiErrorMessage } from "@/errors/apiError";
import { useAuth } from "@/hooks/useAuth";
import { setAuthToken } from "@/lib/auth";
import { requestLogin } from "@/lib/login-popup";
import { PASSWORD_HINT, passwordProblem } from "@/lib/password";

type FieldErrors = {
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
};

export function ChangePasswordForm() {
  const router = useRouter();
  const { isAuthenticated, ready } = useAuth();

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
      router.push("/passport");
    } catch (err) {
      // A 401 (expired session) opens the login popup instead.
      if ((err as { response?: { status?: number } })?.response?.status !== 401) {
        setFormError(getApiErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden mt-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/assets/auth-bg.jpg)` }}
      />
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50" />
      <div className="relative w-full max-w-[420px]">
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-8 group"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-gold transition-transform duration-300 group-hover:rotate-12">
            <KeyRound className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-primary">
            Marco<span className="text-gold">.</span>Passport
          </span>
        </Link>

        <div className="rounded-3xl border border-border/80 bg-card/95 backdrop-blur-sm shadow-elegant overflow-hidden">
          <div className="px-7 pt-7 pb-7">
            <h1 className="text-[1.65rem] font-semibold text-primary leading-tight">
              Change password
            </h1>
            {isAuthenticated ? (
              <>
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
              </>
            ) : (
              <>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  Log in to change your password.
                </p>
                <Button variant="gold" size="lg" className="mt-6 w-full" onClick={() => void requestLogin()}>
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>

        <Link
          href="/passport"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to your Passport
        </Link>
      </div>
    </main>
  );
}
