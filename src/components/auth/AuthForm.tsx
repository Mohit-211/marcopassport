"use client";
import { useState, useCallback } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/AuthShell";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthFields, type FieldErrors } from "@/components/auth/AuthFields";
import { CheckInbox } from "@/components/auth/CheckInbox";
import { loginApi, registerApi, type AuthSession } from "@/api/auth/auth.api";
import { getApiErrorMessage } from "@/errors/apiError";
import { setAuthToken } from "@/lib/auth";
import { passwordProblem } from "@/lib/password";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

// Register answers 400 with this when the email already has an unverified account.
const UNVERIFIED_PATTERN = /not verified/i;

function statusOf(error: unknown) {
  return (error as { response?: { status?: number } })?.response?.status;
}

interface AuthFormProps {
  /** "page" renders its own card (/auth); "popup" sits inside the login dialog */
  variant?: "page" | "popup";
  /** Shown above the form, e.g. "Your session has expired" */
  message?: string | null;
  /** Called once the token is stored */
  onLoggedIn: () => void | Promise<void>;
  /** The popup closes itself when the user leaves for the forgot-password page */
  onLeave?: () => void;
}

export function AuthForm({ variant = "page", message, onLoggedIn, onLeave }: AuthFormProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState<string | null>(null);
  /** Set once an account is waiting for its verification email */
  const [inboxEmail, setInboxEmail] = useState<string | null>(null);

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
        // Existing passwords may predate the current rules, so login only needs one.
        if (mode === "signup") next.password = passwordProblem(fields.password);
        else if (!fields.password) next.password = "Password is required";
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
      return Object.fromEntries(
        Object.entries(next).filter(([, v]) => v),
      ) as FieldErrors;
    },
    [mode, password]
  );
  const switchMode = (target: Mode) => {
    if (target === mode || loading) return;
    setMode(target);
    setErrors({});
    setTouched({});
    setFormError(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
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
    setFormError(null);
    try {
      if (mode === "login") {
        const res = await loginApi({ email: email.trim(), password });
        const session: AuthSession | undefined = res?.data?.data;
        const token = session?.tokens?.access?.token;
        if (!token) throw new Error("Login failed. Please try again.");
        setAuthToken(token);
        await onLoggedIn();
      } else {
        await registerApi({
          name: name.trim(),
          email: email.trim(),
          password,
          confirm_password: confirmPassword,
        });
        setInboxEmail(email.trim());
      }
    } catch (error) {
      const status = statusOf(error);
      const text = getApiErrorMessage(error);
      if (
        (mode === "login" && status === 403 && /verify/i.test(text)) ||
        (mode === "signup" && status === 400 && UNVERIFIED_PATTERN.test(text))
      ) {
        setInboxEmail(email.trim());
      } else if (mode === "signup" && status === 503) {
        setFormError("We couldn't send the verification email, so your account wasn't created. Please try again.");
      } else {
        setFormError(text);
      }
    } finally {
      setLoading(false);
    }
  };
  const isLogin = mode === "login";
  const Shell = variant === "page" ? PageCard : PopupBody;

  if (inboxEmail) {
    return (
      <Shell padded>
        <CheckInbox
          email={inboxEmail}
          onBack={() => {
            setInboxEmail(null);
            setMode("login");
            setPassword("");
            setConfirmPassword("");
          }}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <AuthTabs mode={mode} onSwitch={switchMode} />
      <div className={cn("px-6 pb-6 pt-1 sm:px-8", variant === "page" && "sm:pb-8")}>
        <h1 className="text-[1.65rem] font-semibold leading-tight text-primary sm:text-3xl">
          {isLogin ? "Welcome back" : "Create your Passport"}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {isLogin
            ? "Log in to save your itineraries and see them on any device."
            : "Save places, plan visits, and build your Marco Island itinerary."}
        </p>
        {message && (
          <p role="status" className="mt-4 rounded-xl bg-gold/15 px-4 py-2.5 text-sm text-primary">
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
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
            onForgotPassword={onLeave}
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
            aria-busy={loading}
            className="mt-2 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isLogin ? "Logging in…" : "Creating account…"}
              </>
            ) : isLogin ? (
              "Log In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        {variant === "page" && (
          <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground/80">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>
              Your data is private and secure. We never share your information
              with third parties.
            </span>
          </div>
        )}
      </div>
      <div className="border-t border-border/70 px-6 py-4 text-center text-sm text-muted-foreground sm:px-8">
        {isLogin ? "New to The Marco Passport?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => switchMode(isLogin ? "signup" : "login")}
          className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-gold focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {isLogin ? "Create account" : "Log in"}
        </button>
      </div>
    </Shell>
  );
}

function PageCard({ padded, children }: { padded?: boolean; children: React.ReactNode }) {
  return <AuthCard className={padded ? undefined : "p-0 sm:p-0"}>{children}</AuthCard>;
}

function PopupBody({ padded, children }: { padded?: boolean; children: React.ReactNode }) {
  return <div className={padded ? "p-6 sm:p-8" : undefined}>{children}</div>;
}
