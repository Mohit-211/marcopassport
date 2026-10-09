"use client";

import Link from "next/link";
import { KeyRound, LogIn, LogOut, Map as MapIcon, Plus, User } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useTrips } from "../TripsProvider";

function initials(name?: string, email?: string) {
  const source = name?.trim() || email?.trim() || "";
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join("") || null;
}

/**
 * Global profile menu for the header. Base UI's menu handles outside-click,
 * Escape, focus return and arrow-key navigation.
 */
export function ProfileDropdown({ className }: { className?: string }) {
  const { isAuthenticated, ready, user, logout, loggingOut } = useAuth();
  const { openCreateTrip } = useTrips();
  const label = initials(user?.name, user?.email);

  return (
    <DropdownMenu>
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
                {isAuthenticated ? user?.email : "Trips are saved on this device"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLinkItem render={<Link href="/my-trips" />}>
          <MapIcon className="h-4 w-4" /> My Trips
        </DropdownMenuLinkItem>
        <DropdownMenuItem onClick={() => openCreateTrip()}>
          <Plus className="h-4 w-4" /> Create New Trip
        </DropdownMenuItem>
        {isAuthenticated && (
          <>
            <DropdownMenuLinkItem render={<Link href="/passport" />}>
              <User className="h-4 w-4" /> Your Passport
            </DropdownMenuLinkItem>
            <DropdownMenuLinkItem render={<Link href="/change-password" />}>
              <KeyRound className="h-4 w-4" /> Change Password
            </DropdownMenuLinkItem>
          </>
        )}
        <DropdownMenuSeparator />
        {isAuthenticated ? (
          <DropdownMenuItem variant="destructive" disabled={loggingOut} onClick={() => logout()}>
            <LogOut className="h-4 w-4" /> {loggingOut ? "Signing out…" : "Logout"}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuLinkItem render={<Link href="/auth" />} aria-disabled={!ready}>
            <LogIn className="h-4 w-4" /> Login
          </DropdownMenuLinkItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
