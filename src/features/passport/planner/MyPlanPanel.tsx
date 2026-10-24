"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, CalendarDays, Link2, Loader2, Map as MapIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { withItemMoved, withItemRemoved, withVisitDate } from "../logic";
import { formatDateRange } from "../format";
import { stopLetter } from "../maps";
import { placeImage } from "../place";
import { MAX_PASSPORT_PLACES } from "../types";
import { sharedTripPath } from "./logic";
import type { useActivePlan } from "./use-active-plan";

type ActivePlan = ReturnType<typeof useActivePlan>;

/**
 * "My Plan" tab: the active passport's stops in visiting order (A, B, C… on
 * the map), each with an optional day, reorder and remove, plus Share.
 * Full editing (drag to reorder, rename, driving route) stays in My Passport.
 */
export function MyPlanPanel({
  plan,
  isAuthenticated,
  selectedId,
  onSelect,
}: {
  plan: ActivePlan;
  isAuthenticated: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const { value, save, saving, passport, passports, pick } = plan;

  if (!value) {
    return (
      <p className="m-4 rounded-tile bg-muted p-4 text-sm text-muted-foreground">
        You don&apos;t have a passport yet. Use <strong className="text-primary">Add to passport</strong> on any
        place and choose <strong className="text-primary">New passport</strong>.
      </p>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const minDate = value.start_date && value.start_date > today ? value.start_date : today;
  const passportHref = passport ? `/passport/${passport.id}` : "/passport";

  const share = async () => {
    const url = `${window.location.origin}${sharedTripPath(value)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: value.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied", { description: "Anyone with the link can view this trip." });
    } catch (error) {
      // The user closed the share sheet: nothing to report.
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Couldn't copy the link", { description: url });
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2 border-b border-border px-4 py-3">
        {isAuthenticated && passports.length > 1 ? (
          <select
            aria-label="Passport to plan"
            value={passport?.id}
            onChange={(e) => pick(Number(e.target.value))}
            className="h-9 w-full rounded-tile border border-input bg-background px-3 text-sm font-medium text-primary"
          >
            {passports.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="truncate font-display text-lg font-semibold text-primary">{value.name}</p>
        )}
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDateRange(value.start_date, value.end_date)} · {value.items.length} of {MAX_PASSPORT_PLACES} places
          {saving && <Loader2 className="ml-1 h-3 w-3 animate-spin" aria-label="Saving" />}
        </p>
      </div>

      {value.items.length === 0 ? (
        <p className="m-4 rounded-tile bg-muted p-4 text-sm text-muted-foreground">
          No places yet. Add some from the Places tab and they&apos;ll show here as stops A, B, C…
        </p>
      ) : (
        <ol className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3" aria-label="Stops in visiting order">
          {value.items.map((item, index) => (
            <li
              key={item.place_id}
              className={cn(
                "flex items-center gap-3 rounded-tile border p-2.5 transition-colors",
                selectedId === item.place_id ? "border-gold bg-gold/10" : "border-border",
              )}
            >
              <span
                aria-hidden
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-xs font-bold text-gold-foreground"
              >
                {stopLetter(index)}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={placeImage(item.place.featured_image)} alt="" className="h-11 w-11 shrink-0 rounded-tile object-cover" />
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onSelect(item.place_id)}
                  className="block w-full truncate text-left text-sm font-semibold text-primary hover:underline focus-visible:underline focus-visible:outline-none"
                  aria-label={`Stop ${stopLetter(index)}: ${item.place.name}. Show on map`}
                >
                  {item.place.name}
                </button>
                <Input
                  type="date"
                  aria-label={`Day for ${item.place.name}`}
                  value={item.visit_date ?? ""}
                  min={minDate}
                  max={value.end_date ?? undefined}
                  disabled={saving}
                  onChange={(e) => save(withVisitDate(value, item.place_id, e.target.value || null))}
                  className="mt-1 h-7 rounded-tile px-2 text-xs"
                />
              </div>
              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  aria-label={`Move ${item.place.name} earlier`}
                  disabled={index === 0 || saving}
                  onClick={() => save(withItemMoved(value, index, index - 1))}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-primary disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={`Move ${item.place.name} later`}
                  disabled={index === value.items.length - 1 || saving}
                  onClick={() => save(withItemMoved(value, index, index + 1))}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-primary disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                type="button"
                aria-label={`Remove ${item.place.name} from the plan`}
                disabled={saving}
                onClick={() => save(withItemRemoved(value, item.place_id))}
                className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-wrap gap-2 border-t border-border bg-muted/40 px-4 py-3">
        <Button type="button" variant="gold" size="sm" onClick={share} disabled={value.items.length === 0}>
          <Link2 className="h-3.5 w-3.5" /> Share trip
        </Button>
        <Button variant="outline" size="sm" render={<Link href={passportHref} />} nativeButton={false}>
          <MapIcon className="h-3.5 w-3.5" /> Route in My Passport
        </Button>
      </div>
    </div>
  );
}
