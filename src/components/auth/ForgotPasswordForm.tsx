"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { sendOtpApi } from "@/api/auth/auth.api";

const OTP_TYPE = "forgot_password";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response
      .data.message;
  }
  return fallback;
}

function validateEmail(email: string) {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email";
  return undefined;
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const nextError = validateEmail(email);
    setError(nextError);
    if (nextError) return;

    setLoading(true);
    try {
      await sendOtpApi({ email, type: OTP_TYPE });
      toast.success("OTP sent", {
        description: `Check ${email} for your one-time code.`,
      });
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Could not send OTP. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

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
              Forgot password?
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Enter the email linked to your account and we&apos;ll send you a
              one-time code to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-primary">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
                  <Input
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
                        : "border-input focus-visible:ring-gold/30"
                    )}
                  />
                </div>
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
                    Sending code…
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link
            href="/auth"
            className="font-medium text-primary hover:text-gold transition-colors underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
        <Link
          href="/"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
