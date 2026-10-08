"use client";

import { cn } from "@/lib/utils";

interface AuthTabsProps {
  mode: "login" | "signup";
  onSwitch: (mode: "login" | "signup") => void;
}

const TABS = [
  { value: "login", label: "Sign In" },
  { value: "signup", label: "Create Account" },
] as const;

export function AuthTabs({ mode, onSwitch }: AuthTabsProps) {
  return (
    <div className="relative mx-6 mb-5 mt-6 grid grid-cols-2 rounded-2xl bg-muted/70 p-1.5 sm:mx-8 sm:mt-8">
      <div
        aria-hidden
        className={cn(
          "absolute bottom-1.5 top-1.5 w-[calc(50%-6px)] rounded-xl bg-card shadow-soft transition-[left] duration-300 ease-out",
          mode === "login" ? "left-1.5" : "left-1/2"
        )}
      />
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          aria-pressed={mode === tab.value}
          onClick={() => onSwitch(tab.value)}
          className={cn(
            "relative z-10 rounded-xl py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            mode === tab.value
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
