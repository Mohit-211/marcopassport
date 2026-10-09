"use client";

import { useMemo, useState } from "react";
import { Info, LocateFixed, Minus, Plus } from "lucide-react";

import { MARCO_ISLAND_CENTER } from "@/data/trip-planner";
import { cn } from "@/lib/utils";
import { MapControlButton, pinClassName } from "./map-parts";
import type { MapViewProps } from "./types";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

/**
 * A lightweight stand-in used when no Google Maps key is configured (or the
 * API fails to load). Pins are placed by latitude/longitude on a plain chart.
 */
export function PreviewMap({
  points,
  activeId,
  onSelect,
  showRoute,
  label,
  notice,
}: MapViewProps & { notice: string }) {
  const [zoom, setZoom] = useState(MIN_ZOOM);

  const positioned = useMemo(() => {
    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const pad = 0.006;
    const minLat = Math.min(...lats, MARCO_ISLAND_CENTER.lat) - pad;
    const maxLat = Math.max(...lats, MARCO_ISLAND_CENTER.lat) + pad;
    const minLng = Math.min(...lngs, MARCO_ISLAND_CENTER.lng) - pad;
    const maxLng = Math.max(...lngs, MARCO_ISLAND_CENTER.lng) + pad;
    // Keep pins away from the edges so they're never clipped
    const scale = (v: number, min: number, max: number) => 8 + ((v - min) / (max - min)) * 84;
    return points.map((p) => ({
      ...p,
      x: scale(p.lng, minLng, maxLng),
      y: 100 - scale(p.lat, minLat, maxLat),
    }));
  }, [points]);

  const active = positioned.find((p) => p.id === activeId);
  const focus = zoom > 1 && active ? active : { x: 50, y: 50 };

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-linear-to-br from-accent via-background to-secondary"
      role="region"
      aria-label={label}
    >
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transformOrigin: `${focus.x}% ${focus.y}%`,
          transform: `translate(${50 - focus.x}%, ${50 - focus.y}%) scale(${zoom})`,
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full text-primary/10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((v) => (
            <g key={v} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
              <line x1={v} y1="0" x2={v} y2="100" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1={v} x2="100" y2={v} vectorEffect="non-scaling-stroke" />
            </g>
          ))}
          {showRoute && positioned.length > 1 && (
            <polyline
              points={positioned.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#002946"
              strokeWidth="3"
              strokeDasharray="8 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {positioned.map((p) => (
          <button
            key={p.id}
            type="button"
            data-active={p.id === activeId}
            aria-pressed={p.id === activeId}
            aria-label={p.label ? `Stop ${p.label}: ${p.title}` : p.title}
            title={p.title}
            onClick={() => onSelect?.(p.id)}
            className={cn(
              pinClassName,
              "absolute outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50",
            )}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translate(-50%, -50%) scale(${1 / zoom})`,
            }}
          >
            {p.label ?? <span className="size-2 rounded-full bg-current" />}
          </button>
        ))}
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <MapControlButton
          label="Zoom in"
          disabled={zoom >= MAX_ZOOM}
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.5))}
        >
          <Plus className="size-4" />
        </MapControlButton>
        <MapControlButton
          label="Zoom out"
          disabled={zoom <= MIN_ZOOM}
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.5))}
        >
          <Minus className="size-4" />
        </MapControlButton>
        <MapControlButton label="Recenter map" onClick={() => setZoom(MIN_ZOOM)}>
          <LocateFixed className="size-4" />
        </MapControlButton>
      </div>

      <p className="absolute bottom-3 left-3 right-24 flex items-start gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs text-primary/80 shadow-sm backdrop-blur sm:right-auto sm:max-w-sm">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        {notice}
      </p>
    </div>
  );
}
