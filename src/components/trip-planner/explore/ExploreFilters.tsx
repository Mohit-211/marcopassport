"use client";

import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarRange, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { INTERESTS } from "@/data/trip-planner";
import { priceLabel } from "@/lib/trip-planner/trip-utils";
import { cn } from "@/lib/utils";
import type { Interest, PriceLevel } from "@/types/trip";

export type SortId = "recommended" | "name" | "price-asc" | "price-desc" | "date";

export const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "date", label: "Date (soonest)" },
  { id: "name", label: "Name (A–Z)" },
  { id: "price-asc", label: "Price (low to high)" },
  { id: "price-desc", label: "Price (high to low)" },
];

const toolbarButton =
  "h-9 gap-1.5 rounded-full border-border px-3 text-[13px] text-primary hover:bg-brand-primary-tint";

export function SortSelect({
  value,
  onChange,
}: {
  value: SortId;
  onChange: (value: SortId) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <label htmlFor="explore-sort" className="text-[13px] text-muted-foreground">
        Sort
      </label>
      <select
        id="explore-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortId)}
        className="h-9 rounded-full border border-border bg-white px-3 text-[13px] text-primary outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
}) {
  const label = value?.from
    ? value.to && value.to.getTime() !== value.from.getTime()
      ? `${format(value.from, "MMM d")} – ${format(value.to, "MMM d")}`
      : format(value.from, "MMM d")
    : "Select Dates";

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(toolbarButton, value?.from && "border-brand-primary bg-brand-primary-tint")}
          />
        }
      >
        <CalendarRange aria-hidden />
        {label}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          defaultMonth={value?.from}
        />
        <div className="flex justify-end gap-2 border-t border-border px-1 pt-2">
          <Button variant="ghost" size="sm" disabled={!value} onClick={() => onChange(undefined)}>
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const PRICE_LEVELS: PriceLevel[] = [0, 1, 2, 3, 4];

export function FiltersPopover({
  prices,
  onPricesChange,
  interests,
  onInterestsChange,
}: {
  prices: PriceLevel[];
  onPricesChange: (value: PriceLevel[]) => void;
  interests: Interest[];
  onInterestsChange: (value: Interest[]) => void;
}) {
  const count = prices.length + interests.length;
  const toggle = <T,>(list: T[], value: T) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(toolbarButton, count > 0 && "border-brand-primary bg-brand-primary-tint")}
          />
        }
      >
        <SlidersHorizontal aria-hidden />
        Filters
        {count > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-brand-primary text-[11px] text-white">
            {count}
            <span className="sr-only"> active</span>
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 gap-4 p-4">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-primary">Price</legend>
          <div className="flex flex-wrap gap-2">
            {PRICE_LEVELS.map((level) => (
              <label
                key={level}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[13px] text-primary has-checked:border-brand-primary has-checked:bg-brand-primary-tint has-focus-visible:ring-3 has-focus-visible:ring-brand-primary/50"
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={prices.includes(level)}
                  onChange={() => onPricesChange(toggle(prices, level))}
                />
                {priceLabel(level)}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-primary">Good for</legend>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <label
                key={interest.id}
                className="flex cursor-pointer items-center rounded-full border border-border px-3 py-1 text-[13px] text-primary has-checked:border-brand-primary has-checked:bg-brand-primary-tint has-focus-visible:ring-3 has-focus-visible:ring-brand-primary/50"
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={interests.includes(interest.id)}
                  onChange={() => onInterestsChange(toggle(interests, interest.id))}
                />
                {interest.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end border-t border-border pt-3">
          <Button
            variant="ghost"
            size="sm"
            disabled={count === 0}
            onClick={() => {
              onPricesChange([]);
              onInterestsChange([]);
            }}
          >
            Reset filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
