"use client";

import { useId } from "react";
import { format } from "date-fns";

import { fromDayKey, tripDayKeys, UNSCHEDULED } from "@/lib/trip-planner/trip-utils";
import { cn } from "@/lib/utils";
import type { Trip } from "@/types/trip";

/** Compact select for choosing which trip day new items go to. */
export function DaySelect({
  trip,
  value,
  onChange,
  label = "Adding to",
  className,
}: {
  trip: Trip;
  value: string | null;
  onChange: (day: string) => void;
  label?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={id} className="shrink-0 text-[13px] text-muted-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 min-w-0 flex-1 rounded-full border border-border bg-white px-3 text-[13px] font-medium text-primary outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50"
      >
        {tripDayKeys(trip).map((day, i) => (
          <option key={day} value={day}>
            Day {i + 1} · {format(fromDayKey(day), "EEE, MMM d")}
          </option>
        ))}
        <option value={UNSCHEDULED}>Unscheduled (no day yet)</option>
      </select>
    </div>
  );
}

export function dayNumber(trip: Trip, day: string) {
  return tripDayKeys(trip).indexOf(day) + 1;
}

/** Button label for adding a stop to a day, e.g. "Add to Day 2" or "Save for later". */
export function addToDayLabel(trip: Trip, day: string) {
  return day === UNSCHEDULED ? "Save for later" : `Add to Day ${dayNumber(trip, day)}`;
}
