"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/AuthShell";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthFields, type FieldErrors } from "@/components/auth/AuthFields";
import { loginApi, registerApi } from "@/api/auth/auth.api";
import { getSafeRedirect, setAuthToken } from "@/lib/auth";

const USER_ROLE_ID = 6;

// Only needed after a successful signup, so it stays out of the initial bundle.
const loadSuccessDialog = () => import("@/components/auth/SignupSuccessDialog");
const SignupSuccessDialog = dynamic(
  () => loadSuccessDialog().then((m) => m.SignupSuccessDialog),
  { ssr: false }
);

// Read at navigation time rather than via useSearchParams, which would force
// the whole form to client-render behind a Suspense boundary.
function getRedirectTarget() {
  return getSafeRedirect(
    new URLSearchParams(window.location.search).get("redirect")
  );
}

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    if (target === mode || loading) return;
    setMode(target);
    setErrors({});
    setTouched({});
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
    try {
      if (mode === "login") {
        const res = await loginApi({
          email,
          password,
          role_id: USER_ROLE_ID,
        });
        const token = res?.data?.data?.tokens?.access?.token;
        if (token) {
          setAuthToken(token);
        }
      } else {
        // Fetch the dialog chunk alongside the request so it opens instantly.
        void loadSuccessDialog();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirm_password", confirmPassword);
        formData.append("role_id", String(USER_ROLE_ID));
        const res = await registerApi(formData);
        const token = res?.data?.data?.token ?? res?.data?.token;
        if (token) {
          setAuthToken(token);
        }
        setShowSuccessModal(true);
        return;
      }
      toast.success("Welcome back");
      router.push(getRedirectTarget());
    } catch {
      // The error popup is shown by the global API error handler.
    } finally {
      setLoading(false);
    }
  };
  const isLogin = mode === "login";
  return (
    <>
      <AuthCard className="p-0 sm:p-0">
        <AuthTabs mode={mode} onSwitch={switchMode} />
        <div className="px-6 pb-6 pt-1 sm:px-8 sm:pb-8">
          <h1 className="text-[1.65rem] font-semibold leading-tight text-primary sm:text-3xl">
            {isLogin ? "Welcome back" : "Create your Passport"}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {isLogin
              ? "Sign in to access your saved places and travel plans."
              : "Save places, plan visits, and build your Marco Island itinerary."}
          </p>
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
            />
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
                  {isLogin ? "Signing in…" : "Creating account…"}
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground/80">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>
              Your data is private and secure. We never share your information
              with third parties.
            </span>
          </div>
        </div>
        <div className="border-t border-border/70 px-6 py-4 text-center text-sm text-muted-foreground sm:px-8">
          {isLogin ? "New to The Marco Passport?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(isLogin ? "signup" : "login")}
            className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-gold focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {isLogin ? "Create one" : "Sign in"}
          </button>
        </div>
      </AuthCard>
      {showSuccessModal && (
        <SignupSuccessDialog
          open
          onOpenChange={setShowSuccessModal}
          onContinue={() => {
            setShowSuccessModal(false);
            router.push(getRedirectTarget());
          }}
        />
      )}
    </>
  );
}
