"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AuthCard } from "@/components/auth/AuthShell";
import { sendOtpApi } from "@/api/auth/auth.api";

const OTP_TYPE = "forgot_password";

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
    } catch {
      // The error popup is shown by the global API error handler.
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthCard>
        <h1 className="text-[1.65rem] font-semibold text-primary leading-tight">
          Forgot password?
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          Enter the email linked to your account and we&apos;ll send you a
          one-time code to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-primary">Email</Label>
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
                    : "border-input focus-visible:ring-gold/30",
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
      </AuthCard>

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
    </>
  );
}
