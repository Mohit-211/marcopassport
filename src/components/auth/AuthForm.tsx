"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthFields, type FieldErrors } from "@/components/auth/AuthFields";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { cn } from "@/lib/utils";

export function AuthForm() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [animating, setAnimating] = useState(false);

  const validate = useCallback(
    (fields: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      name?: string;
    }) => {
      const next: FieldErrors = {};
      if (fields.email !== undefined) {
        if (!fields.email) next.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
          next.email = "Please enter a valid email";
      }
      if (fields.password !== undefined) {
        if (!fields.password) next.password = "Password is required";
        else if (fields.password.length < 6)
          next.password = "Password must be at least 6 characters";
      }
      if (fields.confirmPassword !== undefined && mode === "signup") {
        if (!fields.confirmPassword)
          next.confirmPassword = "Please confirm your password";
        else if (fields.confirmPassword !== password)
          next.confirmPassword = "Passwords do not match";
      }
      if (fields.name !== undefined && mode === "signup") {
        if (!fields.name.trim()) next.name = "Name is required";
      }
      return next;
    },
    [mode, password]
  );

  const switchMode = (target: "login" | "signup") => {
    if (target === mode) return;
    setAnimating(true);
    setTimeout(() => {
      setMode(target);
      setErrors({});
      setTouched({});
      setAnimating(false);
    }, 180);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      name: true,
    });

    const allErrors = validate({ email, password, confirmPassword, name });
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    setLoading(true);
    try {
      // Auth wiring goes here later — for now just simulate the request.
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (mode === "login") {
        toast.success("Welcome back");
      } else {
        toast.success("Account created", {
          description: "Your Passport is ready.",
        });
      }
      router.push("/passport");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    toast.info("Google sign-in coming soon", {
      description: "We're working on adding faster sign-in options.",
    });
  };

  const handleForgot = () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    toast.success("Reset link sent", {
      description: `Check ${email} for a password reset link.`,
    });
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/assets/auth-bg.jpg)` }}
      />
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50" />

      <div className="relative w-full max-w-[420px]">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-8 group"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-gold transition-transform duration-300 group-hover:rotate-12">
            <Compass className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-primary">
            Marco<span className="text-gold">.</span>Passport
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-border/80 bg-card/95 backdrop-blur-sm shadow-elegant overflow-hidden">
          <AuthTabs mode={mode} onSwitch={switchMode} />

          <div
            className={cn(
              "px-7 pb-7 pt-1 transition-all duration-200",
              animating
                ? "opacity-0 translate-y-1"
                : "opacity-100 translate-y-0"
            )}
          >
            <h1 className="text-[1.65rem] font-semibold text-primary leading-tight">
              {mode === "login" ? "Welcome back" : "Create your Passport"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {mode === "login"
                ? "Sign in to access your saved places and travel plans."
                : "Save places, plan visits, and build your Marco Island itinerary."}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <AuthFields
                mode={mode}
                name={name}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                errors={errors}
                touched={touched}
                showPassword={showPassword}
                showConfirm={showConfirm}
                onNameChange={(value) => {
                  setName(value);
                  setErrors((prev) => ({
                    ...prev,
                    name: validate({ name: value }).name,
                  }));
                }}
                onEmailChange={(value) => {
                  setEmail(value);
                  setErrors((prev) => ({
                    ...prev,
                    email: validate({ email: value }).email,
                  }));
                }}
                onPasswordChange={(value) => {
                  setPassword(value);
                  setErrors((prev) => ({
                    ...prev,
                    password: validate({ password: value }).password,
                  }));
                }}
                onConfirmPasswordChange={(value) => {
                  setConfirmPassword(value);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: validate({ confirmPassword: value })
                      .confirmPassword,
                  }));
                }}
                onBlurField={(field) =>
                  setTouched((t) => ({ ...t, [field]: true }))
                }
                onToggleShowPassword={() => setShowPassword((s) => !s)}
                onToggleShowConfirm={() => setShowConfirm((s) => !s)}
                onForgotPassword={handleForgot}
              />

              {/* Submit */}
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
                    {mode === "login" ? "Signing in…" : "Creating account…"}
                  </>
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Divider */}
              <div className="relative flex items-center gap-3 my-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  or
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Google */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGoogle}
                className="w-full h-12 rounded-xl border-input hover:bg-muted/60"
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </Button>
            </form>

            {/* Privacy note */}
            <div className="mt-5 flex items-start gap-2 text-xs text-muted-foreground/80">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span>
                Your data is private and secure. We never share your information
                with third parties.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login"
            ? "New to The Marco Passport?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            className="font-medium text-primary hover:text-gold transition-colors underline underline-offset-4"
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
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
