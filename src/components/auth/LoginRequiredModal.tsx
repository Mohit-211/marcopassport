"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const noopSubscribe = () => () => {};

// Sign-in link that brings the user back here with the passport modal open
function getAuthHref() {
  const params = new URLSearchParams(window.location.search);
  params.set("openPassport", "1");
  const currentPath = `${window.location.pathname}?${params.toString()}`;
  return `/auth?redirect=${encodeURIComponent(currentPath)}`;
}

interface LoginRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description?: string;
}

export function LoginRequiredModal({
  open,
  onOpenChange,
  description = "Please sign in to save this to your Passport.",
}: LoginRequiredModalProps) {
  const authHref = useSyncExternalStore(noopSubscribe, getAuthHref, () => "/auth");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-[#002E50]">
            Sign in required
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Link href={authHref} className="inline-flex">
            <Button variant="gold">
              <LogIn className="h-4 w-4" /> Sign in
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
