"use client";

import Link from "next/link";
import { KeyRound, LogIn, LogOut, Map as MapIcon, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { openAuthDialog, requestLogin } from "@/lib/login-popup";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function initials(name?: string, email?: string) {
  const source = name?.trim() || email?.trim() || "";
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return (
    parts
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join("") || null
  );
}

/**
 * Global profile menu for the header. Base UI's menu handles outside-click,
 * Escape, focus return and arrow-key navigation.
 */
export function ProfileDropdown({ className }: { className?: string }) {
  const { isAuthenticated, ready, user, logout, loggingOut } = useAuth();
  const label = initials(user?.name, user?.email);

  return (
    <DropdownMenu>
      <Tooltip
        content={
          isAuthenticated
            ? "Your account and itineraries"
            : "Log in or open My Passport"
        }
        side="bottom"
      >
        <DropdownMenuTrigger
          aria-label="Open profile menu"
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/15 bg-primary/5 text-sm font-semibold text-primary",
            "transition-colors hover:bg-primary/10 data-popup-open:bg-primary/10",
            "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            className,
          )}
        >
          {isAuthenticated && label ? label : <User className="h-4 w-4" />}
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent className="w-64 max-w-[calc(100vw-2rem)]">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {isAuthenticated && label ? label : <User className="h-4 w-4" />}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-primary">
                {isAuthenticated ? user?.name || "Your Passport" : "Guest"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {isAuthenticated
                  ? user?.email
                  : "Log in to save your itineraries"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLinkItem render={<Link href="/passport" />}>
          <MapIcon className="h-4 w-4" /> My Passport
        </DropdownMenuLinkItem>
        {isAuthenticated && (
          <DropdownMenuItem onClick={() => openAuthDialog("change-password")}>
            <KeyRound className="h-4 w-4" /> Change Password
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {isAuthenticated ? (
          <DropdownMenuItem
            variant="destructive"
            disabled={loggingOut}
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />{" "}
            {loggingOut ? "Signing out…" : "Logout"}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            disabled={!ready}
            onClick={() => void requestLogin()}
          >
            <LogIn className="h-4 w-4" /> Log in
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
