"use client";

import { cn } from "@/lib/utils";

interface AuthTabsProps {
  mode: "login" | "signup";
  onSwitch: (mode: "login" | "signup") => void;
}

export function AuthTabs({ mode, onSwitch }: AuthTabsProps) {
  return (
    <div className="relative grid grid-cols-2 bg-muted/50 p-1.5 m-5 rounded-2xl">
      <div
        className={cn(
          "absolute top-1.5 bottom-1.5 w-[calc(50%-3px)] rounded-xl bg-card shadow-sm transition-all duration-300 ease-out",
          mode === "login" ? "left-1.5" : "left-[calc(50%+1.5px)]"
        )}
      />
      <button
        type="button"
        onClick={() => onSwitch("login")}
        className={cn(
          "relative z-10 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200",
          mode === "login"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        )}
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => onSwitch("signup")}
        className={cn(
          "relative z-10 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200",
          mode === "signup"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        )}
      >
        Create Account
      </button>
    </div>
  );
}
