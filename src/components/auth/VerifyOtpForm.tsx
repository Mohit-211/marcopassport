"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AuthCard } from "@/components/auth/AuthShell";
import { sendOtpApi, verifyOtpApi } from "@/api/auth/auth.api";

const OTP_TYPE = "forgot_password";
const RESEND_COOLDOWN_SECONDS = 30;

function extractResetToken(res: unknown): string | undefined {
  const data = (res as { data?: Record<string, unknown> })?.data;
  const inner = (data?.data as Record<string, unknown>) ?? {};
  const token =
    (inner.token as string) ??
    (inner.reset_token as string) ??
    (data?.token as string) ??
    (data?.reset_token as string);
  return typeof token === "string" ? token : undefined;
}

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      router.replace("/auth/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const validateOtp = (value: string) => {
    if (!value) return "Enter the code we sent you";
    if (!/^\d{4,8}$/.test(value)) return "Enter a valid OTP code";
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const nextError = validateOtp(otp);
    setError(nextError);
    if (nextError || !email) return;

    setLoading(true);
    try {
      const res = await verifyOtpApi({ email, otp, type: OTP_TYPE });
      const token = extractResetToken(res);
      const query = new URLSearchParams({ email });
      if (token) query.set("token", token);
      toast.success("Code verified");
      router.push(`/auth/reset-password?${query.toString()}`);
    } catch {
      // The error popup is shown by the global API error handler.
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    try {
      await sendOtpApi({ email, type: OTP_TYPE });
      toast.success("A new code has been sent", { description: email });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      // The error popup is shown by the global API error handler.
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <AuthCard>
        <h1 className="text-[1.65rem] font-semibold text-primary leading-tight">
          Enter verification code
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          We sent a one-time code to{" "}
          <span className="font-medium text-primary">{email}</span>. Enter it
          below to continue.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-primary">
              One-time code
            </Label>
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={8}
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setOtp(value);
                setError(validateOtp(value));
              }}
              onBlur={() => setTouched(true)}
              placeholder="123456"
              className={cn(
                "h-12 rounded-xl border px-4 text-sm tracking-[0.3em] text-center transition-all",
                touched && error
                  ? "border-destructive/60 focus-visible:ring-destructive/30 bg-destructive/5"
                  : "border-input focus-visible:ring-gold/30",
              )}
            />
            {touched && error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

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
                Verifying…
              </>
            ) : (
              "Verify code"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Didn&apos;t get a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="font-medium text-primary hover:text-gold transition-colors underline underline-offset-4 disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </p>
        </form>
      </AuthCard>

      <Link
        href="/auth/forgot-password"
        className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Use a different email
      </Link>
    </>
  );
}
