"use client";

import { useEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resendVerificationApi } from "@/api/auth/auth.api";
import { getApiErrorMessage } from "@/errors/apiError";

// The backend ignores repeat requests within 60 seconds anyway.
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Shown after sign-up, and when a login or sign-up hits an account that
 * hasn't been verified yet. The account only becomes usable once the emailed
 * link is opened, so nothing here logs the user in.
 */
export function CheckInbox({ email, onBack }: { email: string; onBack?: () => void }) {
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resend = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await resendVerificationApi(email);
      setNotice(res?.data?.message || "If that email has an unverified account, a new link is on its way.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold">
        <MailCheck className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-2xl font-semibold leading-tight text-primary">Check your inbox</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        We sent a verification link to <span className="font-medium text-primary">{email}</span>. Open it
        to activate your account. The link expires in 24 hours.
      </p>
      {notice && (
        <p role="status" className="mt-4 rounded-tile bg-muted px-4 py-2.5 text-sm text-primary">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-tile bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        type="button"
        variant="gold"
        size="lg"
        className="mt-6 w-full"
        onClick={resend}
        disabled={sending || cooldown > 0}
      >
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend email"}
      </Button>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm font-medium text-primary underline underline-offset-4 hover:text-gold"
        >
          Back to sign in
        </button>
      )}
    </div>
  );
}
