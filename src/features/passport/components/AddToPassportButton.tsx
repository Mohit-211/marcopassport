"use client";

import { useState } from "react";
import { Check, ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { usePassports } from "../PassportsProvider";
import type { PassportPlace } from "../types";
import { AddToPassportDialog } from "./AddToPassportDialog";

type Size = "sm" | "default" | "lg";

/**
 * "Add to passport" on Explore cards, place pages and the planner. Opens a
 * small popup to pick a visit date and a passport. Once the place is in a
 * passport (or the guest's draft) it reads "Added", and its menu removes it
 * again or adds it to another passport. Every copy of this button reads the
 * same shared state, so they all update together.
 */
export function AddToPassportButton({
  place,
  size = "default",
  className,
  compactLabel,
}: {
  place: PassportPlace;
  size?: Size;
  className?: string;
  /** Shorter label for tight spots such as cards and the mobile action bar */
  compactLabel?: boolean;
}) {
  const { ready, isAuthenticated, loading, isAdded, passportsWith, removeFromPassport, removeFromDraft } =
    usePassports();
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const busy = !ready || (isAuthenticated && loading);
  const added = !busy && isAdded(place.id);
  const holders = isAuthenticated && added ? passportsWith(place.id) : [];

  const remove = async (passportId?: number) => {
    if (!isAuthenticated) return removeFromDraft(place);
    if (passportId === undefined) return;
    setRemoving(true);
    try {
      await removeFromPassport(passportId, place);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      {added ? (
        <DropdownMenu>
          <Tooltip content="In your passport. Remove it, or add it to another passport.">
            <DropdownMenuTrigger
              disabled={removing}
              render={<Button type="button" variant="added" size={size} className={className} />}
            >
              {removing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Added
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
          </Tooltip>
          <DropdownMenuContent className="w-64 max-w-[calc(100vw-2rem)]">
            <DropdownMenuLabel className="truncate">
              {holders.length > 1 ? `In ${holders.length} of your passports` : "In your passport"}
            </DropdownMenuLabel>
            {isAuthenticated ? (
              holders.map((passport) => (
                <DropdownMenuItem key={passport.id} variant="destructive" onClick={() => remove(passport.id)}>
                  <Trash2 />
                  <span className="truncate">Remove from {passport.name}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem variant="destructive" onClick={() => remove()}>
                <Trash2 /> Remove from passport
              </DropdownMenuItem>
            )}
            {isAuthenticated && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Plus /> Add to another passport
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Tooltip
          content={
            isAuthenticated
              ? "Add it to one of your passports and pick a visit date."
              : "Add it to a passport on this device. No account needed until you save."
          }
        >
          <Button
            type="button"
            variant="gold"
            size={size}
            disabled={busy}
            onClick={() => setOpen(true)}
            className={className}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {compactLabel ? "Add" : "Add to passport"}
          </Button>
        </Tooltip>
      )}
      <AddToPassportDialog place={place} open={open} onOpenChange={setOpen} />
    </>
  );
}
