"use client";

import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
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
  onForgotPassword: () => void;
}

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
  onForgotPassword,
}: AuthFieldsProps) {
  const inputClass = (fieldName: keyof FieldErrors) =>
    cn(
      "h-12 rounded-xl border pl-11 pr-4 text-sm transition-all",
      touched[fieldName] && errors[fieldName]
        ? "border-destructive/60 focus-visible:ring-destructive/30 bg-destructive/5"
        : "border-input focus-visible:ring-gold/30"
    );

  return (
    <>
      {/* Name — signup only */}
      {mode === "signup" && (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-primary">Full name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={() => onBlurField("name")}
              placeholder="Jane Doe"
              className={inputClass("name")}
            />
          </div>
          {touched.name && errors.name && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <span className="inline-block">{errors.name}</span>
            </p>
          )}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-primary">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => onBlurField("email")}
            placeholder="you@example.com"
            className={inputClass("email")}
          />
        </div>
        {touched.email && errors.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-primary">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={() => onBlurField("password")}
            placeholder="••••••••"
            className={cn(inputClass("password"), "pr-11")}
          />
          <button
            type="button"
            onClick={onToggleShowPassword}
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
          <p className="text-xs text-destructive">{errors.password}</p>
        )}

        {/* Forgot password — login only */}
        {mode === "login" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
            >
              Forgot password?
            </button>
          </div>
        )}
      </div>

      {/* Confirm password — signup only */}
      {mode === "signup" && (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-primary">
            Confirm password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
            <Input
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              onBlur={() => onBlurField("confirmPassword")}
              placeholder="••••••••"
              className={cn(inputClass("confirmPassword"), "pr-11")}
            />
            <button
              type="button"
              onClick={onToggleShowConfirm}
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
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>
      )}
    </>
  );
}
