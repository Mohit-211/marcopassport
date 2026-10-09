"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ChevronDown, ChevronUp, Clock, GripVertical, Minus, StickyNote } from "lucide-react";

import { formatTime } from "@/lib/trip-planner/trip-utils";
import { cn } from "@/lib/utils";
import type { ItineraryEntry } from "@/types/trip";
import type { DashboardItem } from "./controller";

interface ItineraryEntryRowProps {
  entry: ItineraryEntry;
  item: DashboardItem;
  index: number;
  count: number;
  readOnly?: boolean;
  active?: boolean;
  dragging?: boolean;
  dropTarget?: boolean;
  /** Shown instead of the time for stops without a day */
  scheduleSlot?: React.ReactNode;
  onFocusStop: () => void;
  /** Omit to hide reordering */
  onMove?: (to: number) => void;
  onRemove: () => void;
  /** Omit to hide the time field */
  onTimeChange?: (time: string) => void;
  /** Omit to hide notes editing */
  onNotesChange?: (notes: string) => void;
  dragHandlers: Pick<
    React.HTMLAttributes<HTMLLIElement>,
    "onDragStart" | "onDragOver" | "onDrop" | "onDragEnd"
  >;
}

const smallButton =
  "inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50";
const iconButton =
  "grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30 outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50";

export function ItineraryEntryRow({
  entry,
  item,
  index,
  count,
  readOnly,
  active,
  dragging,
  dropTarget,
  scheduleSlot,
  onFocusStop,
  onMove,
  onRemove,
  onTimeChange,
  onNotesChange,
  dragHandlers,
}: ItineraryEntryRowProps) {
  const notesId = useId();
  const canReorder = !readOnly && !!onMove;
  const canEditTime = !readOnly && !!onTimeChange;
  const [editingNotes, setEditingNotes] = useState(false);
  // Only start a drag from the handle so inputs stay usable
  const [dragArmed, setDragArmed] = useState(false);

  return (
    <li
      id={`stop-${entry.id}`}
      draggable={canReorder && dragArmed}
      {...(canReorder ? dragHandlers : {})}
      onDragEnd={(e) => {
        setDragArmed(false);
        dragHandlers.onDragEnd?.(e);
      }}
      className={cn(
        "relative flex scroll-mt-4 gap-2.5 rounded-xl border bg-card p-2.5 shadow-soft transition-all break-inside-avoid",
        active ? "border-brand-primary ring-2 ring-brand-primary/15" : "border-border",
        dragging && "opacity-40",
        dropTarget && "border-dashed border-brand-primary bg-brand-primary-tint",
      )}
    >
      {canReorder && (
        <div
          aria-hidden
          title="Drag to reorder"
          onPointerDown={() => setDragArmed(true)}
          onPointerUp={() => setDragArmed(false)}
          className="-mx-1 hidden cursor-grab touch-none items-center text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing sm:flex print:hidden"
        >
          <GripVertical className="size-4" />
        </div>
      )}

      <span
        className={cn(
          "mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-brand-primary text-[11px] font-semibold text-primary-foreground",
          active && "ring-2 ring-gold",
        )}
      >
        {index + 1}
      </span>

      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted print:hidden">
        {/* Remote API images aren't in next.config, so skip optimisation for them */}
        <Image src={item.image} alt="" fill sizes="56px" className="object-cover" unoptimized={item.image.startsWith("http")} />
      </div>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onFocusStop}
          className="rounded text-left text-sm font-semibold leading-snug text-foreground hover:text-brand-primary outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/50"
        >
          {item.name}
          <span className="sr-only">, show on map</span>
        </button>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {item.subtitle}
        </p>

        {scheduleSlot ?? (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {!canEditTime ? (
              entry.time && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Clock className="size-3.5 text-muted-foreground" aria-hidden />
                {formatTime(entry.time)}
              </span>
              )
            ) : (
              <>
                <input
                  // Re-mount when the saved time changes so the field shows it
                  key={entry.time}
                  type="time"
                  defaultValue={entry.time}
                  aria-label={`Time for ${item.name}`}
                  // Save on blur so the list doesn't re-sort while typing
                  onBlur={(e) => {
                    if (e.target.value && e.target.value !== entry.time) onTimeChange?.(e.target.value);
                  }}
                  className="w-23 rounded-md border border-transparent bg-transparent px-1 font-medium text-foreground outline-none hover:border-border focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/30 print:hidden"
                />
                <span className="hidden font-medium text-foreground print:inline">
                  {formatTime(entry.time)}
                </span>
              </>
            )}
          </p>
        )}

        {editingNotes ? (
          <div className="mt-2 print:hidden">
            <label htmlFor={notesId} className="sr-only">
              Notes for {item.name}
            </label>
            <textarea
              id={notesId}
              autoFocus
              rows={2}
              maxLength={500}
              defaultValue={entry.notes}
              placeholder="Reservation number, what to bring…"
              onBlur={(e) => {
                onNotesChange?.(e.target.value.trim());
                setEditingNotes(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.stopPropagation();
                  setEditingNotes(false);
                }
              }}
              className="w-full resize-y rounded-lg border border-border px-2.5 py-1.5 text-sm outline-none focus-visible:border-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/30"
            />
            <p className="text-[11px] text-muted-foreground">Saved when you click away. Esc to cancel.</p>
          </div>
        ) : entry.notes ? (
          <p className="mt-1.5 whitespace-pre-wrap rounded-lg bg-muted px-2.5 py-1.5 text-xs text-foreground/80">
            {entry.notes}
          </p>
        ) : null}

        {!readOnly && (
          <div className="mt-2 flex flex-wrap items-center gap-1 print:hidden">
            <button
              type="button"
              onClick={onRemove}
              className={cn(smallButton, "bg-muted text-foreground/80 hover:bg-red-50 hover:text-destructive")}
            >
              <Minus className="size-3.5" aria-hidden />
              Remove
              <span className="sr-only"> {item.name}</span>
            </button>
            {!editingNotes && onNotesChange && (
              <button
                type="button"
                onClick={() => setEditingNotes(true)}
                className={cn(smallButton, "text-brand-primary hover:bg-brand-primary-tint")}
              >
                <StickyNote className="size-3.5" aria-hidden />
                {entry.notes ? "Edit note" : "Note"}
                <span className="sr-only"> for {item.name}</span>
              </button>
            )}
            {canReorder && count > 1 && (
              <span className="ml-auto flex">
                <button
                  type="button"
                  className={iconButton}
                  disabled={index === 0}
                  onClick={() => onMove?.(index - 1)}
                  aria-label={`Move ${item.name} earlier`}
                >
                  <ChevronUp className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  className={iconButton}
                  disabled={index === count - 1}
                  onClick={() => onMove?.(index + 1)}
                  aria-label={`Move ${item.name} later`}
                >
                  <ChevronDown className="size-4" aria-hidden />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
