"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { changePasswordApi } from "@/api/auth/auth.api";
import { useAuth } from "@/hooks/useAuth";

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

type FieldErrors = {
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
};

export function ChangePasswordForm() {
  const router = useRouter();
  const { isAuthenticated, ready, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [ready, isAuthenticated, router]);

  const validate = (fields: {
    currentPassword?: string;
    password?: string;
    confirmPassword?: string;
  }) => {
    const next: FieldErrors = {};
    if (fields.currentPassword !== undefined) {
      if (!fields.currentPassword)
        next.currentPassword = "Current password is required";
    }
    if (fields.password !== undefined) {
      if (!fields.password) next.password = "New password is required";
      else if (fields.password.length < 6)
        next.password = "Password must be at least 6 characters";
    }
    if (fields.confirmPassword !== undefined) {
      if (!fields.confirmPassword)
        next.confirmPassword = "Please confirm your new password";
      else if (fields.confirmPassword !== password)
        next.confirmPassword = "Passwords do not match";
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ currentPassword: true, password: true, confirmPassword: true });
    const allErrors = validate({ currentPassword, password, confirmPassword });
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    setLoading(true);
    try {
      await changePasswordApi({
        old_password: currentPassword,
        new_password: password,
        confirm_password: confirmPassword,
      });
      toast.success("Password updated", {
        description: "Please sign in again with your new password.",
      });
      await logout();
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Could not update password. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName: keyof FieldErrors) =>
    cn(
      "h-12 rounded-xl border pl-11 pr-11 text-sm transition-all",
      touched[fieldName] && errors[fieldName]
        ? "border-destructive/60 focus-visible:ring-destructive/30 bg-destructive/5"
        : "border-input focus-visible:ring-gold/30"
    );

  if (!ready || !isAuthenticated) {
    return null;
  }

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
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Update the password for your account.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-primary">
                  Current password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
                  <Input
                    type={showCurrent ? "text" : "password"}
                    autoComplete="current-password"
                    autoFocus
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        currentPassword: validate({
                          currentPassword: e.target.value,
                        }).currentPassword,
                      }));
                    }}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, currentPassword: true }))
                    }
                    placeholder="••••••••"
                    className={inputClass("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showCurrent ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
                {touched.currentPassword && errors.currentPassword && (
                  <p className="text-xs text-destructive">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-primary">
                  New password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        password: validate({ password: e.target.value })
                          .password,
                      }));
                    }}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, password: true }))
                    }
                    placeholder="••••••••"
                    className={inputClass("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-primary">
                  Confirm new password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: validate({
                          confirmPassword: e.target.value,
                        }).confirmPassword,
                      }));
                    }}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, confirmPassword: true }))
                    }
                    placeholder="••••••••"
                    className={inputClass("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword}
                  </p>
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
                    Updating password…
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
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
