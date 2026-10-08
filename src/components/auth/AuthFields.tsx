"use client";

import Link from "next/link";
import { Lock, Mail, User, Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

interface AuthFieldsProps {
  mode: "login" | "signup";
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  errors: FieldErrors;
  touched: Record<string, boolean>;
  showPassword: boolean;
  showConfirm: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onBlurField: (field: keyof FieldErrors) => void;
  onToggleShowPassword: () => void;
  onToggleShowConfirm: () => void;
}

const iconClass =
  "pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground/70";

const toggleClass =
  "absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground/60 transition-colors hover:text-muted-foreground";

// Fields that appear on mode switch fade in; the initial form renders without animation.
const revealClass = "animate-in fade-in-0 slide-in-from-top-1 duration-200";

export function AuthFields({
  mode,
  name,
  email,
  password,
  confirmPassword,
  errors,
  touched,
  showPassword,
  showConfirm,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onBlurField,
  onToggleShowPassword,
  onToggleShowConfirm,
}: AuthFieldsProps) {
  const hasError = (fieldName: keyof FieldErrors) =>
    Boolean(touched[fieldName] && errors[fieldName]);

  const inputClass = (fieldName: keyof FieldErrors) =>
    cn(
      "h-12 rounded-xl border bg-background pl-11 pr-4 text-base transition-colors sm:text-sm",
      hasError(fieldName)
        ? "border-destructive/60 bg-destructive/5 focus-visible:ring-destructive/30"
        : "border-input focus-visible:border-gold focus-visible:ring-gold/30"
    );

  // aria wiring so screen readers announce the inline error with the field.
  const a11y = (fieldName: keyof FieldErrors) => ({
    id: `auth-${fieldName}`,
    "aria-invalid": hasError(fieldName) || undefined,
    "aria-describedby": hasError(fieldName)
      ? `auth-${fieldName}-error`
      : undefined,
  });

  const fieldError = (fieldName: keyof FieldErrors) =>
    hasError(fieldName) && (
      <p id={`auth-${fieldName}-error`} className="text-xs text-destructive">
        {errors[fieldName]}
      </p>
    );

  const forgotHref = `/auth/forgot-password${
    email ? `?email=${encodeURIComponent(email)}` : ""
  }`;

  const iconInput = (Icon: LucideIcon, input: React.ReactNode) => (
    <div className="relative">
      <Icon className={iconClass} aria-hidden />
      {input}
    </div>
  );

  return (
    <>
      {/* Name — signup only */}
      {mode === "signup" && (
        <div className={cn("space-y-1.5", revealClass)}>
          <Label htmlFor="auth-name" className="text-sm font-medium text-primary">
            Full name
          </Label>
          {iconInput(
            User,
            <Input
              {...a11y("name")}
              autoComplete="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={() => onBlurField("name")}
              placeholder="Jane Doe"
              className={inputClass("name")}
            />
          )}
          {fieldError("name")}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="auth-email" className="text-sm font-medium text-primary">
          Email
        </Label>
        {iconInput(
          Mail,
          <Input
            {...a11y("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => onBlurField("email")}
            placeholder="you@example.com"
            className={inputClass("email")}
          />
        )}
        {fieldError("email")}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <Label
            htmlFor="auth-password"
            className="text-sm font-medium text-primary"
          >
            Password
          </Label>
          {/* Forgot password — login only */}
          {mode === "login" && (
            <Link
              href={forgotHref}
              className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          )}
        </div>
        {iconInput(
          Lock,
          <>
            <Input
              {...a11y("password")}
              type={showPassword ? "text" : "password"}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              onBlur={() => onBlurField("password")}
              placeholder="••••••••"
              className={cn(inputClass("password"), "pr-12")}
            />
            <button
              type="button"
              onClick={onToggleShowPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className={toggleClass}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="size-4.5" />
              ) : (
                <Eye className="size-4.5" />
              )}
            </button>
          </>
        )}
        {fieldError("password")}
      </div>

      {/* Confirm password — signup only */}
      {mode === "signup" && (
        <div className={cn("space-y-1.5", revealClass)}>
          <Label
            htmlFor="auth-confirmPassword"
            className="text-sm font-medium text-primary"
          >
            Confirm password
          </Label>
          {iconInput(
            Lock,
            <>
              <Input
                {...a11y("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                onBlur={() => onBlurField("confirmPassword")}
                placeholder="••••••••"
                className={cn(inputClass("confirmPassword"), "pr-12")}
              />
              <button
                type="button"
                onClick={onToggleShowConfirm}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                aria-pressed={showConfirm}
                className={toggleClass}
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="size-4.5" />
                ) : (
                  <Eye className="size-4.5" />
                )}
              </button>
            </>
          )}
          {fieldError("confirmPassword")}
        </div>
      )}
    </>
  );
}
