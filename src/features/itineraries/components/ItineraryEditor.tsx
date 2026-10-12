"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, CalendarDays, Compass, ExternalLink, GripVertical, Store, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { withItemMoved, withItemRemoved, withVisitDate } from "../logic";
import { directionsUrl, stopLetter, type TravelMode } from "../maps";
import { placeHref, placeImage } from "../place";
import { MAX_ITINERARY_PLACES, type ItineraryDraft, type ItineraryItem } from "../types";
import { ItineraryMap } from "./ItineraryMap";

/**
 * The itinerary screen, shared by saved itineraries and the guest draft: the
 * ordered places on the left (drag or arrows to reorder, remove, a visit date
 * each, rename, trip dates), the route map on the right. All edits stay in the
 * parent's state; `actions` (Save / Delete…) decide what happens to them.
 */
export function ItineraryEditor({
  value,
  onChange,
  actions,
  notice,
}: {
  value: ItineraryDraft;
  onChange: (next: ItineraryDraft) => void;
  actions: React.ReactNode;
  notice?: React.ReactNode;
}) {
  const [mode, setMode] = useState<TravelMode>("driving");
  const places = value.items.map((item) => item.place);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
      <div className="min-w-0 space-y-5">
        {notice}
        <TripDetails value={value} onChange={onChange} />

        <section aria-labelledby="itinerary-places" className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="itinerary-places" className="font-display text-xl font-semibold text-primary">
              Places
            </h2>
            <span className="text-xs text-muted-foreground">
              {value.items.length} of {MAX_ITINERARY_PLACES}
            </span>
          </div>
          {value.items.length === 0 ? <EmptyPlaces /> : <PlaceList value={value} onChange={onChange} mode={mode} />}
        </section>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">{actions}</div>
      </div>

      <ItineraryMap
        places={places}
        mode={mode}
        onModeChange={setMode}
        className="lg:sticky lg:top-24"
      />
    </div>
  );
}

function TripDetails({ value, onChange }: { value: ItineraryDraft; onChange: (next: ItineraryDraft) => void }) {
  const setDate = (key: "start_date" | "end_date") => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [key]: e.target.value || null });

  return (
    <div className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="space-y-1.5">
        <Label htmlFor="itinerary-name" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Itinerary name
        </Label>
        <Input
          id="itinerary-name"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          maxLength={150}
          className="h-12 rounded-xl font-display text-lg font-semibold text-primary"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="itinerary-start" className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <CalendarDays className="h-3.5 w-3.5" /> Start date
          </Label>
          <Input
            id="itinerary-start"
            type="date"
            value={value.start_date ?? ""}
            max={value.end_date ?? undefined}
            onChange={setDate("start_date")}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="itinerary-end" className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <CalendarDays className="h-3.5 w-3.5" /> End date
          </Label>
          <Input
            id="itinerary-end"
            type="date"
            value={value.end_date ?? ""}
            min={value.start_date ?? undefined}
            onChange={setDate("end_date")}
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

function PlaceList({
  value,
  onChange,
  mode,
}: {
  value: ItineraryDraft;
  onChange: (next: ItineraryDraft) => void;
  mode: TravelMode;
}) {
  // Drag starts from the handle only, so the date input and links behave normally.
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const count = value.items.length;
  const move = (from: number, to: number) => onChange(withItemMoved(value, from, to));

  const endDrag = () => {
    setDragging(null);
    setOver(null);
  };

  return (
    <ol className="space-y-2">
      {value.items.map((item, index) => {
        const next = value.items[index + 1];
        return (
          <li
            key={item.place_id}
            onDragOver={(e) => {
              if (dragging === null) return;
              e.preventDefault();
              setOver(index);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragging !== null) move(dragging, index);
              endDrag();
            }}
            onDragEnd={endDrag}
          >
            <PlaceRow
              item={item}
              index={index}
              count={count}
              value={value}
              onChange={onChange}
              onMove={move}
              onDragStart={() => setDragging(index)}
              onDragEnd={endDrag}
              dragging={dragging === index}
              dropTarget={over === index && dragging !== null && dragging !== index}
            />
            {next && (
              <a
                href={directionsUrl(item.place, next.place, mode)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-12 mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary hover:underline"
              >
                Directions {stopLetter(index)} → {stopLetter(index + 1)}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function PlaceRow({
  item,
  index,
  count,
  value,
  onChange,
  onMove,
  onDragStart,
  onDragEnd,
  dragging,
  dropTarget,
}: {
  item: ItineraryItem;
  index: number;
  count: number;
  value: ItineraryDraft;
  onChange: (next: ItineraryDraft) => void;
  onMove: (from: number, to: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  dragging: boolean;
  dropTarget: boolean;
}) {
  const { place } = item;
  const href = placeHref(place);
  const dateId = `visit-date-${item.place_id}`;
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rowRef}
      className={cn(
        "flex items-start gap-2 rounded-2xl border border-border bg-card p-2.5 shadow-sm transition sm:gap-3 sm:p-3",
        dragging && "opacity-50",
        dropTarget && "ring-2 ring-gold",
      )}
    >
      <button
        type="button"
        aria-label={`Drag to reorder ${place.name}`}
        title="Drag to reorder"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(index));
          if (rowRef.current) e.dataTransfer.setDragImage(rowRef.current, 24, 24);
          onDragStart();
        }}
        onDragEnd={onDragEnd}
        className="hidden cursor-grab self-center rounded-md p-1 text-muted-foreground hover:text-primary active:cursor-grabbing sm:block"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span
        aria-label={`Stop ${stopLetter(index)}`}
        className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
      >
        {stopLetter(index)}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={placeImage(place.featured_image)}
        alt=""
        loading="lazy"
        className="h-16 w-16 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {place.type === "business" && <Store className="h-3.5 w-3.5 shrink-0 text-gold" aria-label="Business" />}
          {href ? (
            <Link href={href} className="truncate font-medium text-primary hover:underline">
              {place.name}
            </Link>
          ) : (
            <span className="truncate font-medium text-primary">{place.name}</span>
          )}
        </div>
        {place.address && <p className="truncate text-xs text-muted-foreground">{place.address}</p>}
        <div className="mt-2 flex items-center gap-2">
          <Label htmlFor={dateId} className="sr-only">
            Visit date for {place.name}
          </Label>
          <Input
            id={dateId}
            type="date"
            value={item.visit_date ?? ""}
            min={value.start_date ?? undefined}
            max={value.end_date ?? undefined}
            onChange={(e) => onChange(withVisitDate(value, item.place_id, e.target.value))}
            className="h-8 w-auto rounded-lg px-2 text-xs"
          />
          {!item.visit_date && <span className="hidden text-xs text-muted-foreground sm:inline">No date</span>}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <IconButton label={`Move ${place.name} up`} disabled={index === 0} onClick={() => onMove(index, index - 1)}>
          <ArrowUp className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label={`Move ${place.name} down`} disabled={index === count - 1} onClick={() => onMove(index, index + 1)}>
          <ArrowDown className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton
          label={`Remove ${place.name}`}
          onClick={() => onChange(withItemRemoved(value, item.place_id))}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  label,
  className,
  ...props
}: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:pointer-events-none disabled:opacity-30",
        className,
      )}
      {...props}
    />
  );
}

function EmptyPlaces() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border bg-card/60 p-8 text-center">
      <Compass className="mx-auto h-8 w-8 text-gold" />
      <p className="mt-3 font-medium text-primary">No places yet</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Use &ldquo;Add to itinerary&rdquo; on any place or business to add it here.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link href="/explore">
          <Button variant="gold" size="sm">
            Browse Explore
          </Button>
        </Link>
      </div>
    </div>
  );
}
