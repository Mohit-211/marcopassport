"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Info, Loader2, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoTip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { hasPlace } from "../logic";
import { useItineraries } from "../ItinerariesProvider";
import { formatDateRange } from "../format";
import { placeImage } from "../place";
import {
  DEFAULT_ITINERARY_NAME,
  MAX_ITINERARY_PLACES,
  type Itinerary,
  type ItineraryPlace,
} from "../types";

const NEW = "new";

/**
 * "Add to passport" popup used from Explore cards and detail pages: pick a
 * visit date (optional) and which itinerary to add the place to, without
 * leaving the page. Guests add to their on-device draft instead.
 */
export function AddToItineraryDialog({
  place,
  open,
  onOpenChange,
}: {
  place: ItineraryPlace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent overlayClassName="bg-black/60 backdrop-blur-sm" className="inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] translate-x-0 translate-y-0 overflow-y-auto overscroll-contain sm:max-w-[460px]">
        {open && <AddForm place={place} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function isFull(itinerary: Itinerary) {
  return (
    (itinerary.item_count ?? itinerary.items?.length ?? 0) >=
    MAX_ITINERARY_PLACES
  );
}

function AddForm({
  place,
  onClose,
}: {
  place: ItineraryPlace;
  onClose: () => void;
}) {
  const router = useRouter();
  const {
    isAuthenticated,
    itineraries,
    draft,
    addToDraft,
    addToItinerary,
    createItinerary,
  } = useItineraries();
  const available = itineraries.filter(
    (i) => !hasPlace(i.items ?? [], place.id) && !isFull(i),
  );
  const [target, setTarget] = useState<string>(
    available[0] ? String(available[0].id) : NEW,
  );
  const [newName, setNewName] = useState(DEFAULT_ITINERARY_NAME);
  const [visitDate, setVisitDate] = useState("");
  const [saving, setSaving] = useState(false);

  const selected = itineraries.find((i) => String(i.id) === target);
  const inDraft = !isAuthenticated && hasPlace(draft?.items ?? [], place.id);
  const today = new Date().toISOString().slice(0, 10);
  // Keep the date inside the chosen itinerary's trip dates, when it has them.
  const minDate =
    selected?.start_date && selected.start_date > today
      ? selected.start_date
      : today;
  const maxDate = selected?.end_date ?? undefined;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inDraft) return;
    setSaving(true);
    try {
      let done = false;
      if (!isAuthenticated) {
        done = addToDraft(place, visitDate || null);
      } else if (target === NEW) {
        const itinerary = await createItinerary({
          name: newName.trim() || DEFAULT_ITINERARY_NAME,
          items: [{ place_id: place.id, visit_date: visitDate || null }],
        });
        if (itinerary) {
          toast.success(`Added to ${itinerary.name}`, {
            description: place.name,
            action: {
              label: "Open",
              onClick: () => router.push(`/passport/${itinerary.id}`),
            },
          });
          done = true;
        }
      } else {
        done = await addToItinerary(Number(target), place, visitDate || null);
      }
      if (done) onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <DialogHeader className="pr-8">
        <DialogTitle className="font-display text-xl text-primary sm:text-2xl">
          Add to passport
        </DialogTitle>
        <DialogDescription>
          Pick a date if you know it. You can change it later in My Passport.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-muted/50 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={placeImage(place.featured_image)}
          alt=""
          className="h-12 w-12 shrink-0 rounded-xl object-cover sm:h-14 sm:w-14"
        />
        <div className="min-w-0">
          <p className="truncate font-display font-semibold text-primary">
            {place.name}
          </p>
          {place.address && (
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" /> {place.address}
            </p>
          )}
        </div>
      </div>

      {inDraft ? (
        <div className="mt-5 flex items-start gap-2 rounded-2xl bg-gold/15 p-4 text-sm text-primary">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            This place is already in your itinerary.{" "}
            <Link
              href="/passport"
              onClick={onClose}
              className="font-medium underline underline-offset-4"
            >
              View it
            </Link>
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
          <div className="space-y-1.5">
            <Label
              htmlFor="add-visit-date"
              className="flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              <CalendarDays className="h-3.5 w-3.5" /> Visit date{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
              <InfoTip label="About the visit date">
                The day you plan to go. Leave it empty if you&apos;re not sure;
                you can set or change it later in My Passport.
              </InfoTip>
            </Label>
            <Input
              id="add-visit-date"
              type="date"
              value={visitDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="rounded-xl"
            />
          </div>

          {isAuthenticated ? (
            <fieldset className="space-y-2">
              <legend className="mb-2 flex items-center gap-1.5 text-sm font-medium text-primary">
                Itinerary
                <InfoTip label="About itineraries">
                  An itinerary is one trip plan. Keep separate ones for
                  different trips; each holds up to {MAX_ITINERARY_PLACES}{" "}
                  places.
                </InfoTip>
              </legend>
              {itineraries.map((itinerary) => {
                const added = hasPlace(itinerary.items ?? [], place.id);
                const full = !added && isFull(itinerary);
                return (
                  <Choice
                    key={itinerary.id}
                    value={String(itinerary.id)}
                    checked={target === String(itinerary.id)}
                    disabled={added || full}
                    onSelect={setTarget}
                    title={itinerary.name}
                    detail={
                      added
                        ? "Already added"
                        : full
                          ? `Full (${MAX_ITINERARY_PLACES} places)`
                          : `${formatDateRange(itinerary.start_date, itinerary.end_date)} · ${itinerary.item_count ?? itinerary.items?.length ?? 0} places`
                    }
                  />
                );
              })}
              <Choice
                value={NEW}
                checked={target === NEW}
                onSelect={setTarget}
                title={
                  <span className="flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> New passport
                  </span>
                }
              />
              {target === NEW && (
                <Input
                  aria-label="New passport name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  maxLength={150}
                  className="rounded-xl"
                />
              )}
            </fieldset>
          ) : (
            <p className="flex items-start gap-2 rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              It goes into your passport on this device. Log in from My
              Passport to save it to your account.
            </p>
          )}
        </div>
      )}

      <DialogFooter className="sticky -bottom-4 z-10 mt-6 bg-popover [&>button]:w-full sm:[&>button]:w-auto">
        <Button type="button" variant="outline" onClick={onClose}>
          {inDraft ? "Close" : "Cancel"}
        </Button>
        {!inDraft && (
          <Button type="submit" variant="gold" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add to passport
          </Button>
        )}
      </DialogFooter>
    </form>
  );
}

function Choice({
  value,
  checked,
  disabled,
  onSelect,
  title,
  detail,
}: {
  value: string;
  checked: boolean;
  disabled?: boolean;
  onSelect: (value: string) => void;
  title: React.ReactNode;
  detail?: string;
}) {
  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors",
        checked
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40",
        disabled && "cursor-not-allowed opacity-55 hover:border-border",
      )}
    >
      <input
        type="radio"
        name="itinerary"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onSelect(value)}
        className="h-4 w-4 shrink-0 accent-primary"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-primary">
          {title}
        </span>
        {detail && (
          <span className="block truncate text-xs text-muted-foreground">
            {detail}
          </span>
        )}
      </span>
    </label>
  );
}
