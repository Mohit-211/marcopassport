"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Info, LogIn, MapPin, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { Skeleton } from "@/components/ui/skeleton";
import { requestLogin } from "@/lib/login-popup";
import { clearDraft } from "../draft-store";
import { draftProblem, emptyDraft } from "../logic";
import { useItineraries } from "../ItinerariesProvider";
import { formatDateRange } from "../format";
import { placeImage } from "../place";
import type { Itinerary } from "../types";
import { ItineraryEditor } from "./ItineraryEditor";
import { NewItineraryDialog } from "./NewItineraryDialog";

/** Content area under the passport heroes. */
export const passportShell = "bg-background py-12 md:py-16";

/** /passport — guests build a draft here; signed-in users see their itineraries. */
export function PassportPage() {
  const { ready, isAuthenticated } = useItineraries();
  const [creating, setCreating] = useState(false);

  return (
    <>
      <PageHero
        image="/assets/place-sunset.jpg"
        imageAlt="Sunset over a Marco Island pier"
        icon={Sparkles}
        eyebrow="My Passport"
        title={
          <>
            Plan your <span className="italic text-gold">itinerary</span>
          </>
        }
        description={
          ready && isAuthenticated
            ? "Your Marco Island trip plans. Open one to reorder stops, pick visit dates and see the route on the map."
            : "Add places from Explore, put them in visiting order and see the route on the map. Log in when you're ready to save it."
        }
      >
        {ready && isAuthenticated && (
          <Button variant="gold" size="lg" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> New itinerary
          </Button>
        )}
      </PageHero>
      <section className={passportShell}>
        <div className="site-container">
          {!ready ? (
            <ListSkeleton />
          ) : isAuthenticated ? (
            <ItineraryList creating={creating} setCreating={setCreating} />
          ) : (
            <GuestDraft />
          )}
        </div>
      </section>
    </>
  );
}

function GuestDraft() {
  const { draft, setDraft } = useItineraries();
  const value = draft ?? emptyDraft();
  const [confirmClear, setConfirmClear] = useState(false);

  const save = () => {
    const problem = draftProblem(value);
    if (problem) {
      toast.error(problem);
      return;
    }
    // After login the provider saves this draft and opens the new itinerary.
    void requestLogin("Log in or create an account to save your itinerary.");
  };

  return (
    <>
      <ItineraryEditor
        value={value}
        onChange={setDraft}
        notice={
          <p className="flex items-start gap-2 rounded-2xl bg-gold/15 px-4 py-3 text-sm text-primary">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            This itinerary is only kept on this device until you save it to an account.
          </p>
        }
        actions={
          <>
            <Button variant="gold" size="lg" onClick={save} disabled={value.items.length === 0}>
              <LogIn className="h-4 w-4" /> Save itinerary
            </Button>
            {draft && (
              <Button variant="ghost" onClick={() => setConfirmClear(true)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            )}
          </>
        }
      />
      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear this itinerary?"
        description="All places in it will be removed from this device."
        confirmLabel="Clear"
        onConfirm={clearDraft}
      />
    </>
  );
}

function ItineraryList({
  creating,
  setCreating,
}: {
  creating: boolean;
  setCreating: (open: boolean) => void;
}) {
  const router = useRouter();
  const { itineraries, loading, error, reload, createItinerary, draft, completeLogin } = useItineraries();
  const [savingDraft, setSavingDraft] = useState(false);

  return (
    <>
      <h2 className="mb-6 font-display text-2xl font-semibold text-primary md:text-3xl">My itineraries</h2>

      {draft && draft.items.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-primary">
            You have an unsaved itinerary from before you logged in ({draft.items.length}{" "}
            {draft.items.length === 1 ? "place" : "places"}).
          </p>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="gold"
              size="sm"
              disabled={savingDraft}
              onClick={async () => {
                setSavingDraft(true);
                const saved = await completeLogin();
                setSavingDraft(false);
                if (saved) router.push(`/passport/${saved.id}`);
              }}
            >
              Save it
            </Button>
            <Button variant="ghost" size="sm" onClick={clearDraft}>
              Discard
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <div className="rounded-3xl bg-card p-10 text-center shadow-sm">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="mt-5" onClick={reload}>
            Try again
          </Button>
        </div>
      ) : itineraries.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-primary/15 bg-card/60 p-10 text-center sm:p-16">
          <MapPin className="mx-auto h-8 w-8 text-gold" />
          <h2 className="mt-4 font-display text-2xl font-semibold text-primary">No itineraries yet</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Start one here, or use &ldquo;Add to itinerary&rdquo; on any place or business.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="gold" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> New itinerary
            </Button>
            <Link href="/explore">
              <Button variant="outline">Browse Explore</Button>
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((itinerary) => (
            <ItineraryCard key={itinerary.id} itinerary={itinerary} />
          ))}
        </ul>
      )}

      <NewItineraryDialog
        open={creating}
        onOpenChange={setCreating}
        onCreate={async (name) => {
          const itinerary = await createItinerary({ name });
          if (itinerary) router.push(`/passport/${itinerary.id}`);
          return Boolean(itinerary);
        }}
      />
    </>
  );
}

function ItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  const items = itinerary.items ?? [];
  const count = itinerary.item_count ?? items.length;
  const covers = items.slice(0, 3).map((item) => placeImage(item.place?.featured_image));

  return (
    <li>
      <Link
        href={`/passport/${itinerary.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="relative h-40 overflow-hidden bg-primary">
          {covers.length > 0 ? (
            <div className="grid h-full gap-0.5" style={{ gridTemplateColumns: `repeat(${covers.length}, 1fr)` }}>
              {covers.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ))}
            </div>
          ) : (
            <div className="grid h-full place-items-center text-gold/70">
              <MapPin className="h-10 w-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/10 to-transparent" />
          <h3 className="absolute inset-x-4 bottom-3 truncate font-display text-2xl font-semibold text-white">
            {itinerary.name}
          </h3>
        </div>
        <div className="flex flex-1 items-center justify-between gap-3 p-5 text-sm">
          <div className="min-w-0 space-y-1">
            <p className="flex items-center gap-2 font-medium text-primary">
              <CalendarDays className="h-4 w-4 shrink-0 text-gold" />
              <span className="truncate">{formatDateRange(itinerary.start_date, itinerary.end_date)}</span>
            </p>
            <p className="text-muted-foreground">
              {count} {count === 1 ? "place" : "places"}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </li>
  );
}

function ListSkeleton() {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <li key={i} className="overflow-hidden rounded-3xl bg-card shadow-sm">
          <Skeleton className="h-40 rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
