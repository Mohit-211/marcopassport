"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AuthCard } from "@/components/auth/AuthShell";
import { forgotPasswordApi } from "@/api/auth/auth.api";
import { getApiErrorMessage } from "@/errors/apiError";

function validateEmail(email: string) {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email";
  return undefined;
}

/** Step 1 of the link-based reset: the email with the link goes to /reset-password. */
export function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  /** The backend's generic "if an account exists…" reply, shown as is */
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const nextError = validateEmail(email);
    setError(nextError);
    if (nextError) return;

    setLoading(true);
    setFormError(null);
    try {
      const res = await forgotPasswordApi(email.trim());
      setSentMessage(
        res?.data?.message || "If an account exists for that email, a password reset link is on its way.",
      );
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthCard>
        {sentMessage ? (
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold">
              <MailCheck className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-[1.65rem] font-semibold leading-tight text-primary">Check your inbox</h1>
            <p role="status" className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {sentMessage}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The link works once and expires in 1 hour.
            </p>
            <button
              type="button"
              onClick={() => setSentMessage(null)}
              className="mt-6 text-sm font-medium text-primary underline underline-offset-4 hover:text-gold"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-[1.65rem] font-semibold text-primary leading-tight">
              Forgot password?
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Enter the email linked to your account and we&apos;ll send you a
              link to choose a new password.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="forgot-email" className="text-sm font-medium text-primary">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
                  <Input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(validateEmail(e.target.value));
                    }}
                    onBlur={() => setTouched(true)}
                    placeholder="you@example.com"
                    className={cn(
                      "h-12 rounded-xl border pl-11 pr-4 text-sm transition-all",
                      touched && error
                        ? "border-destructive/60 focus-visible:ring-destructive/30 bg-destructive/5"
                        : "border-input focus-visible:ring-gold/30",
                    )}
                  />
                </div>
                {touched && error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}
              </div>

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
                    Sending link…
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </>
        )}
      </AuthCard>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href="/auth"
          className="font-medium text-primary hover:text-gold transition-colors underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
      <Link
        href="/"
        className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>
    </>
  );
}
