"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Plus, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddToPassportModal } from "@/components/passport/AddToPassportModal";
import {
  PassportItemCard,
  type PassportItem,
} from "@/components/passport/PassportItemCard";
import { PassportEmptyState } from "@/components/passport/PassportEmptyState";

// TODO: replace with real passport data once wired up. Starting empty so the
// UI reflects the true "no saved places yet" state.
const INITIAL_ITEMS: PassportItem[] = [];

export function PassportPage() {
  const router = useRouter();
  const { isAuthenticated, ready, user, logout, loggingOut } = useAuth();
  const [items, setItems] = useState<PassportItem[]>(INITIAL_ITEMS);
  const [editing, setEditing] = useState<PassportItem | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<PassportItem | null>(null);

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [ready, isAuthenticated, router]);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (!ready || !isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Hero */}
      <section className="relative isolate h-[78vh] overflow-hidden bg-primary text-primary-foreground">
        {/* Content */}
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center gap-8 px-6 sm:px-8 lg:px-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-5 sm:text-[11px]">
              <span className="h-px w-8 bg-gold/70" />
              <Sparkles className="h-3.5 w-3.5" /> Your itinerary
            </div>

            {/* Heading */}
            <h1 className="font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
              My <span className="italic text-gold">Passport</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
              Plan and manage your visits across Marco Island. Add places, pick
              dates and build the trip you've been imagining.
            </p>
            <p className="mt-4 text-sm text-primary-foreground/60">
              Signed in as{" "}
              <span className="font-medium text-gold">
                {user?.name || user?.email}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/explore">
              <Button variant="gold" size="lg" className="group">
                <Plus className="h-4 w-4" /> Add More Places
              </Button>
            </Link>
            <Link href="/passport/change-password">
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <KeyRound className="h-4 w-4" /> Change Password
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => logout()}
              disabled={loggingOut}
              className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              <LogOut className="h-4 w-4" />{" "}
              {loggingOut ? "Signing out…" : "Sign Out"}
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-5 lg:px-8 max-w-5xl">
          {items.length === 0 ? (
            <PassportEmptyState />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#002E50]">
                  Saved places{" "}
                  <span className="text-muted-foreground font-normal">
                    ({items.length})
                  </span>
                </h2>
              </div>
              <ul className="space-y-4">
                {items.map((item) => (
                  <PassportItemCard
                    key={item.id}
                    item={item}
                    onEdit={setEditing}
                    onRemove={setConfirmRemove}
                  />
                ))}
              </ul>

              <div className="mt-10 text-center">
                <Link href="/explore">
                  <Button variant="outline" size="lg" className="rounded-xl">
                    <Plus className="h-4 w-4" /> Add More Places
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Edit modal */}
      {editing && (
        <AddToPassportModal
          open={!!editing}
          onOpenChange={(o: boolean) => !o && setEditing(null)}
          source={{
            refId: editing.refId,
            name: editing.name,
            category: editing.category,
            image: editing.image,
            location: editing.location,
          }}
          existing={editing}
        />
      )}

      {/* Remove confirmation */}
      <AlertDialog
        open={!!confirmRemove}
        onOpenChange={(o) => !o && setConfirmRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Passport?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmRemove?.name} will be removed from your saved places. You
              can always add it back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmRemove) {
                  removeItem(confirmRemove.id);
                  toast.success("Removed from your Passport");
                }
                setConfirmRemove(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
