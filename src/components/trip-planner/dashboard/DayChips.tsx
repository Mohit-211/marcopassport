"use client";

import { useRef } from "react";
import { format } from "date-fns";
import { CalendarDays, ChevronRight } from "lucide-react";

import { fromDayKey } from "@/lib/trip-planner/trip-utils";
import { cn } from "@/lib/utils";

export type DayFilter = "all" | string;

const chip = (active: boolean) =>
  cn(
    "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
    "outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50",
    active
      ? "border-brand-primary bg-brand-primary text-primary-foreground shadow-soft"
      : "border-border bg-card text-foreground hover:border-brand-primary/40",
  );

const short = (day: string) => format(fromDayKey(day), "MM/dd");

/** Trip range, "All", then one chip per day. Filters the itinerary list. */
export function DayChips({
  days,
  value,
  onChange,
  extra,
}: {
  days: string[];
  value: DayFilter;
  onChange: (value: DayFilter) => void;
  /** Extra chips after the days, e.g. Unscheduled */
  extra?: { id: string; label: string }[];
}) {
  const scroller = useRef<HTMLUListElement>(null);

  return (
    <nav aria-label="Filter itinerary by day" className="flex items-center gap-2 print:hidden">
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
        <CalendarDays className="size-3.5" aria-hidden />
        <span className="sr-only">Trip dates </span>
        {short(days[0])}–{short(days.at(-1)!)}
      </span>
      <ul
        ref={scroller}
        className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto scroll-smooth [scrollbar-width:none]"
      >
        <li>
          <button type="button" aria-pressed={value === "all"} onClick={() => onChange("all")} className={chip(value === "all")}>
            All
          </button>
        </li>
        {days.map((day) => (
          <li key={day}>
            <button
              type="button"
              aria-pressed={value === day}
              aria-label={format(fromDayKey(day), "EEEE, MMMM d")}
              onClick={() => onChange(day)}
              className={chip(value === day)}
            >
              {short(day)}
            </button>
          </li>
        ))}
        {extra?.map((x) => (
          <li key={x.id}>
            <button type="button" aria-pressed={value === x.id} onClick={() => onChange(x.id)} className={chip(value === x.id)}>
              {x.label}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        aria-label="Scroll to more days"
        onClick={() => scroller.current?.scrollBy({ left: 160 })}
        className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50"
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  );
}
