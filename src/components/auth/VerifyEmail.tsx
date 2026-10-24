"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { AlertTriangle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resendVerificationApi, verifyEmailApi, type AuthSession } from "@/api/auth/auth.api";
import { getApiErrorMessage } from "@/errors/apiError";
import { setAuthToken } from "@/lib/auth";

// The token is single use, so React's dev double-run of effects (or a
// re-render) reuses the first attempt.
const verifications = new Map<string, Promise<void>>();

function verifyOnce(token: string) {
  let pending = verifications.get(token);
  if (!pending) {
    pending = verifyEmailApi(token).then((res) => {
      const session = res?.data?.data as AuthSession | undefined;
      const accessToken = session?.tokens?.access?.token;
      if (!accessToken) throw new Error("This verification link is invalid or has expired.");
      setAuthToken(accessToken);
    });
    verifications.set(token, pending);
  }
  return pending;
}

/**
 * Inside the account dialog, opened from the sign-up email
 * (`?auth=verify-email&token=…`). Verifying is a POST made here (not a plain
 * GET link) so email link scanners can't verify accounts on their own.
 * Success logs the user in; `onVerified` then saves any guest passport draft.
 */
export function VerifyEmail({
  token,
  onVerified,
  onLogIn,
}: {
  token: string;
  onVerified: () => void | Promise<void>;
  /** Switches the dialog to the login step */
  onLogIn: () => void;
}) {
  const [error, setError] = useState<string | null>(
    token ? null : "This verification link is missing its token.",
  );
  // Not an effect dependency: a re-render with a new callback mustn't log in twice.
  const handleVerified = useEffectEvent(() => {
    void onVerified();
  });

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    verifyOnce(token)
      .then(() => {
        if (!cancelled) handleVerified();
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!error) {
    return (
      <div role="status" className="flex flex-col items-center p-6 py-12 text-center sm:p-8 sm:py-14">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <h2 className="mt-4 text-xl font-semibold text-primary">Verifying your email…</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">This only takes a moment.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-2xl font-semibold leading-tight text-primary">We couldn&apos;t verify your email</h2>
        <p role="alert" className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {error}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If you already verified, just log in. Otherwise, send yourself a new link.
        </p>
        <Button variant="gold" size="lg" className="mt-6 w-full" onClick={onLogIn}>
          Log in
        </Button>
      </div>
      <ResendForm />
    </div>
  );
}

function ResendForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await resendVerificationApi(email.trim());
      setNotice(res?.data?.message || "If that email has an unverified account, a new link is on its way.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="mt-6 space-y-3 border-t border-border/70 pt-6">
      <Label htmlFor="resend-email" className="text-sm font-medium text-primary">
        Send a new verification link
      </Label>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/70" />
        <Input
          id="resend-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-12 rounded-tile pl-11"
        />
      </div>
      {notice && <p role="status" className="text-sm text-primary">{notice}</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="outline" size="lg" className="w-full" disabled={sending}>
        {sending && <Loader2 className="h-4 w-4 animate-spin" />} Resend email
      </Button>
    </form>
  );
}
