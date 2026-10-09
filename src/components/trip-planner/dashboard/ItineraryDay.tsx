"use client";

import { useState } from "react";
import { Map as MapIcon, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ItineraryEntry } from "@/types/trip";
import type { DashboardItem, EntryPatch } from "./controller";
import { ItineraryEntryRow } from "./ItineraryEntryRow";

interface ItineraryDayProps {
  /** Day key, used for element ids */
  day: string;
  /** e.g. "10/08" or "Unscheduled Stops" */
  title: string;
  subtitle?: string;
  entries: ItineraryEntry[];
  getItem: (itemId: string) => DashboardItem | undefined;
  selected: boolean;
  activeEntryId: string | null;
  readOnly?: boolean;
  emptyText: string;
  /** Hide on screen but keep for print (used by the date filter) */
  hiddenOnScreen?: boolean;
  onSelectDay: () => void;
  onFocusEntry: (entryId: string) => void;
  onAddStop?: () => void;
  onMove?: (from: number, to: number) => void;
  onRemove?: (entryId: string) => void;
  onUpdate?: (entryId: string, patch: EntryPatch) => void;
  /** Renders the "move to a day" control for unscheduled stops */
  renderSchedule?: (entry: ItineraryEntry) => React.ReactNode;
}

export function ItineraryDay({
  day,
  title,
  subtitle,
  entries,
  getItem,
  selected,
  activeEntryId,
  readOnly,
  emptyText,
  hiddenOnScreen,
  onSelectDay,
  onFocusEntry,
  onAddStop,
  onMove,
  onRemove,
  onUpdate,
  renderSchedule,
}: ItineraryDayProps) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const headingId = `day-${day}`;

  return (
    <section
      id={`${headingId}-section`}
      aria-labelledby={headingId}
      className={cn("scroll-mt-4 py-4 break-inside-avoid-page", hiddenOnScreen && "hidden print:block")}
    >
      <header className="flex items-center gap-2">
        <h3 id={headingId} className="text-base font-bold text-foreground">
          <button
            type="button"
            onClick={onSelectDay}
            aria-pressed={selected}
            className="rounded outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50"
          >
            {title}
            {subtitle && <span className="ml-2 text-sm font-normal text-muted-foreground">{subtitle}</span>}
            <span className="sr-only">{selected ? ", shown on map" : ", show on map"}</span>
          </button>
        </h3>
        {selected && (
          <span className="flex items-center gap-1 rounded-full bg-brand-primary-tint px-2 py-0.5 text-[11px] font-medium text-brand-primary print:hidden">
            <MapIcon className="size-3" aria-hidden />
            On map
          </span>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {entries.length} {entries.length === 1 ? "stop" : "stops"}
        </span>
      </header>

      {!readOnly && onAddStop && (
        <button
          type="button"
          onClick={onAddStop}
          className="mt-1.5 flex items-center gap-1.5 rounded text-sm font-medium text-brand-primary hover:underline underline-offset-2 outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50 print:hidden"
        >
          <MapPin className="size-4" aria-hidden />
          Add a stop
          <span className="sr-only"> to {title}</span>
        </button>
      )}

      {entries.length > 0 ? (
        <ol className="mt-3 flex flex-col gap-2">
          {entries.map((entry, index) => {
            const item = getItem(entry.itemId);
            if (!item) return null;
            return (
              <ItineraryEntryRow
                key={entry.id}
                entry={entry}
                item={item}
                index={index}
                count={entries.length}
                readOnly={readOnly}
                active={entry.id === activeEntryId}
                dragging={dragFrom === index}
                dropTarget={dragOver === index && dragFrom !== index}
                scheduleSlot={renderSchedule?.(entry)}
                onFocusStop={() => onFocusEntry(entry.id)}
                onMove={onMove && ((to) => onMove(index, to))}
                onRemove={() => onRemove?.(entry.id)}
                onTimeChange={onUpdate && ((time) => onUpdate(entry.id, { time }))}
                onNotesChange={onUpdate && ((notes) => onUpdate(entry.id, { notes }))}
                dragHandlers={{
                  onDragStart: (e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", entry.id);
                    setDragFrom(index);
                  },
                  onDragOver: (e) => {
                    if (dragFrom === null) return;
                    e.preventDefault();
                    setDragOver(index);
                  },
                  onDrop: (e) => {
                    e.preventDefault();
                    if (dragFrom !== null && dragFrom !== index) onMove?.(dragFrom, index);
                    setDragFrom(null);
                    setDragOver(null);
                  },
                  onDragEnd: () => {
                    setDragFrom(null);
                    setDragOver(null);
                  },
                }}
              />
            );
          })}
        </ol>
      ) : (
        <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-4 text-center text-sm text-muted-foreground">
          {emptyText}
        </p>
      )}
    </section>
  );
}
