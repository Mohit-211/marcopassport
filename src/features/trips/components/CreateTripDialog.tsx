"use client";

import { useState } from "react";
import { CalendarIcon, MapPin } from "lucide-react";
import { DEFAULT_DESTINATION, DESTINATION_SUGGESTIONS } from "@/data/trip-planner";
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
import { validateTripInput } from "../trip-logic";
import type { NormalizedItem, TripInput } from "../types";

interface TripFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: TripInput) => Promise<void>;
  initial?: TripInput;
  /** Shown as "will be added" context when creating from Add to Trip */
  pendingItem?: NormalizedItem | null;
  mode?: "create" | "edit";
}

const EMPTY: TripInput = { name: "", location: DEFAULT_DESTINATION, startDate: "", endDate: "" };

/** Create or edit a trip's name and dates. */
export function CreateTripDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
  pendingItem,
  mode = "create",
}: TripFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        {open && (
          <TripForm
            initial={initial ?? EMPTY}
            pendingItem={pendingItem}
            mode={mode}
            onCancel={() => onOpenChange(false)}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TripForm({
  initial,
  pendingItem,
  mode,
  onCancel,
  onSubmit,
}: {
  initial: TripInput;
  pendingItem?: NormalizedItem | null;
  mode: "create" | "edit";
  onCancel: () => void;
  onSubmit: (input: TripInput) => Promise<void>;
}) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof TripInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validateTripInput(values);
    setError(problem);
    if (problem) return;
    setSaving(true);
    try {
      await onSubmit({ ...values, name: values.name.trim(), location: values.location.trim() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl text-[#002E50]">
          {mode === "edit" ? "Edit trip" : "Create a Trip"}
        </DialogTitle>
        <DialogDescription>
          {pendingItem
            ? `Name your trip, choose a location and pick dates. ${pendingItem.name} will be added to it.`
            : "Name your trip, choose where you're going and pick your dates."}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="trip-name" className="text-sm font-medium text-primary">
            Trip name
          </Label>
          <Input
            id="trip-name"
            value={values.name}
            onChange={set("name")}
            placeholder="Spring weekend on Marco"
            className="rounded-xl"
            autoFocus
            maxLength={80}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="trip-location" className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <MapPin className="h-3.5 w-3.5" /> Location
          </Label>
          <Input
            id="trip-location"
            list="trip-location-options"
            value={values.location}
            onChange={set("location")}
            onFocus={(e) => e.target.select()}
            placeholder="Where are you going?"
            className="rounded-xl"
            autoComplete="off"
            maxLength={120}
          />
          <datalist id="trip-location-options">
            {DESTINATION_SUGGESTIONS.map((place) => (
              <option key={place} value={place} />
            ))}
          </datalist>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="trip-start" className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <CalendarIcon className="h-3.5 w-3.5" /> Start date
            </Label>
            <Input id="trip-start" type="date" value={values.startDate} onChange={set("startDate")} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trip-end" className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <CalendarIcon className="h-3.5 w-3.5" /> End date
            </Label>
            <Input
              id="trip-end"
              type="date"
              value={values.endDate}
              min={values.startDate || undefined}
              onChange={set("endDate")}
              className="rounded-xl"
            />
          </div>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="gold" disabled={saving}>
          {saving ? "Saving…" : mode === "edit" ? "Save changes" : pendingItem ? "Create & add" : "Create trip"}
        </Button>
      </DialogFooter>
    </form>
  );
}
