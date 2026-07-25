"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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

// TODO: replace with real auth/store once wired up. Starting empty so the
// UI reflects the true "no saved places yet" state.
const INITIAL_ITEMS: PassportItem[] = [];
const CURRENT_USER_EMAIL = "you@example.com";

export function PassportPage() {
  const [items, setItems] = useState<PassportItem[]>(INITIAL_ITEMS);
  const [editing, setEditing] = useState<PassportItem | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<PassportItem | null>(null);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleLogout = () => {
    // TODO: wire up real sign-out once auth exists
    toast.success("Signed out");
  };

  return (
    <>
      {/* Header */}
      <section className="bg-[#002E50] text-primary-foreground">
        <div className="container mx-auto px-5 lg:px-8 py-14 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-[#EBBD00]">
                <Sparkles className="h-3.5 w-3.5" /> Your itinerary
              </div>
              <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold tracking-tight">
                My Passport
              </h1>
              <p className="mt-3 text-primary-foreground/80 text-base sm:text-lg max-w-xl">
                Plan and manage your visits across Marco Island. Add places,
                pick dates and build the trip you've been imagining.
              </p>
              <p className="mt-4 text-sm text-primary-foreground/60">
                Signed in as{" "}
                <span className="text-[#EBBD00] font-medium">
                  {CURRENT_USER_EMAIL}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/explore">
                <Button variant="gold" size="lg" className="group">
                  <Plus className="h-4 w-4" /> Add More Places
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={handleLogout}
                className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
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
