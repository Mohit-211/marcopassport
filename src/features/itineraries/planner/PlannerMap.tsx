"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { ExploreItem } from "@/lib/explore";
import { stopLetter } from "../maps";
import {
  loadGoogleMaps,
  mapsErrorMessage,
  MAP_ID,
  type GMap,
  type GMarker,
  type GPolyline,
  type GoogleMapsApi,
} from "./google-maps";
import { MARCO_ISLAND, position } from "./logic";

/** Navy pin for listings, gold for the selected one; plan stops are lettered like My Passport. */
function pinElement(label: string, tone: "default" | "selected" | "stop") {
  const el = document.createElement("div");
  const styles = {
    default: "background:#16324a;color:#fff;border:2px solid #fff;width:22px;height:22px;font-size:0",
    selected: "background:#c9a24a;color:#16324a;border:3px solid #fff;width:30px;height:30px;font-size:0",
    stop: "background:#c9a24a;color:#16324a;border:2px solid #16324a;width:26px;height:26px;font-size:12px",
  }[tone];
  el.style.cssText = `${styles};border-radius:9999px;display:grid;place-items:center;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,.3);transition:transform .15s`;
  el.textContent = label;
  return el;
}

/**
 * A pin plus its hover card (photo and name), shown above the pin on hover.
 * The marker is lifted above its neighbours while hovered so the card isn't
 * hidden under other pins. Uses the theme's CSS variables, so it follows dark
 * mode; text goes in via textContent, never as HTML.
 */
function markerContent(
  marker: GMarker,
  item: Pick<ExploreItem, "name" | "image">,
  label: string,
  tone: "default" | "selected" | "stop",
  baseZIndex: number | null,
) {
  const wrap = document.createElement("div");
  wrap.style.cssText = "position:relative;display:grid;place-items:center";
  wrap.append(pinElement(label, tone));

  const card = document.createElement("div");
  card.setAttribute("aria-hidden", "true");
  card.style.cssText =
    "position:absolute;bottom:calc(100% + 8px);left:50%;transform:translate(-50%,4px);width:176px;" +
    "overflow:hidden;border-radius:14px;background:var(--card);color:var(--card-foreground);" +
    "box-shadow:0 10px 25px rgba(0,0,0,.25);border:1px solid var(--border);" +
    "opacity:0;visibility:hidden;transition:opacity .15s,transform .15s,visibility .15s;pointer-events:none";

  const img = document.createElement("img");
  img.src = item.image;
  img.alt = "";
  img.loading = "lazy";
  img.width = 176;
  img.height = 96;
  img.style.cssText = "display:block;width:176px;height:96px;object-fit:cover;background:var(--muted)";
  // A broken photo falls back to the site's placeholder.
  img.onerror = () => {
    img.onerror = null;
    img.src = "/assets/explore-hero.jpg";
  };

  const name = document.createElement("p");
  name.textContent = item.name;
  name.style.cssText =
    "margin:0;padding:8px 10px;font-family:var(--font-display);font-size:13px;font-weight:600;line-height:1.25;" +
    "color:var(--primary);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden";

  card.append(img, name);
  wrap.append(card);

  const show = (visible: boolean) => {
    card.style.opacity = visible ? "1" : "0";
    card.style.visibility = visible ? "visible" : "hidden";
    card.style.transform = `translate(-50%,${visible ? 0 : 4}px)`;
    marker.zIndex = visible ? 2000 : baseZIndex;
  };
  wrap.addEventListener("mouseenter", () => show(true));
  wrap.addEventListener("mouseleave", () => show(false));
  return wrap;
}

/**
 * The planner's interactive map: a marker per listing in the current results,
 * the selected one highlighted, and the plan's stops lettered A, B, C… with a
 * line in visiting order. (Straight lines: road routing would need the billed
 * Directions API; My Passport's embed map shows the driving route.)
 */
export function PlannerMap({
  items,
  stops,
  selectedId,
  onSelect,
}: {
  items: ExploreItem[];
  /** Plan stops in visiting order */
  stops: ExploreItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<GoogleMapsApi | null>(null);
  const [map, setMap] = useState<GMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const markers = useRef(new Map<number, GMarker>());
  const stopLayer = useRef<{ markers: GMarker[]; line: GPolyline | null }>({ markers: [], line: null });
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Load the API and create the map once.
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !containerRef.current) return;
        window.gm_authFailure = () => setError(mapsErrorMessage(new Error("auth-failure")));
        setApi(maps);
        setMap(
          new maps.Map(containerRef.current, {
            center: MARCO_ISLAND,
            zoom: 13,
            mapId: MAP_ID,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: false,
          }),
        );
      })
      .catch((e) => !cancelled && setError(mapsErrorMessage(e)));
    return () => {
      cancelled = true;
    };
  }, []);

  // One marker per result.
  useEffect(() => {
    if (!api || !map) return;
    const current = markers.current;
    current.forEach((m) => (m.map = null));
    current.clear();

    for (const item of items) {
      const pos = position(item);
      if (!pos) continue;
      const marker = new api.AdvancedMarkerElement({
        map,
        position: pos,
        title: item.name,
        gmpClickable: true,
      });
      marker.content = markerContent(marker, item, "", "default", null);
      marker.addListener("click", () => onSelectRef.current(item.id));
      current.set(item.id, marker);
    }
  }, [api, map, items]);

  // Fit the map to the results, or to the plan's stops when no results are
  // shown (the My Plan tab). Re-fits only when that set changes.
  const fitTarget = useMemo(() => (items.length > 0 ? items : stops), [items, stops]);
  useEffect(() => {
    if (!api || !map) return;
    const points = fitTarget.map(position).filter((p): p is NonNullable<typeof p> => p !== null);
    if (points.length > 1) {
      const bounds = new api.LatLngBounds();
      points.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, 56);
    } else if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(15);
    } else {
      map.setCenter(MARCO_ISLAND);
      map.setZoom(13);
    }
  }, [api, map, fitTarget]);

  // Highlight the selected marker and zoom to it.
  useEffect(() => {
    if (!api || !map) return;
    const byId = new Map(items.map((i) => [i.id, i]));
    markers.current.forEach((marker, id) => {
      const selected = id === selectedId;
      const item = byId.get(id);
      const zIndex = selected ? 1000 : null;
      marker.zIndex = zIndex;
      if (item) marker.content = markerContent(marker, item, "", selected ? "selected" : "default", zIndex);
    });
    const item = items.find((i) => i.id === selectedId) ?? stops.find((s) => s.id === selectedId);
    const pos = item && position(item);
    if (pos) {
      map.panTo(pos);
      if ((map.getZoom() ?? 0) < 15) map.setZoom(15);
    }
  }, [api, map, items, stops, selectedId]);

  // Plan stops: lettered pins joined in visiting order.
  useEffect(() => {
    if (!api || !map) return;
    const layer = stopLayer.current;
    layer.markers.forEach((m) => (m.map = null));
    layer.markers = [];
    const path = stops.map(position).filter((p): p is NonNullable<typeof p> => p !== null);
    stops.forEach((stop, index) => {
      const pos = position(stop);
      if (!pos) return;
      const marker = new api.AdvancedMarkerElement({
        map,
        position: pos,
        title: `Stop ${stopLetter(index)}: ${stop.name}`,
        zIndex: 900,
        gmpClickable: true,
      });
      marker.content = markerContent(marker, stop, stopLetter(index), "stop", 900);
      marker.addListener("click", () => onSelectRef.current(stop.id));
      layer.markers.push(marker);
    });
    if (!layer.line) {
      layer.line = new api.Polyline({
        map,
        strokeColor: "#c9a24a",
        strokeOpacity: 0.9,
        strokeWeight: 3,
        geodesic: true,
      });
    }
    layer.line.setPath(path.length > 1 ? path : []);
  }, [api, map, stops]);

  return (
    <div className="relative h-full min-h-60 w-full bg-muted">
      <div ref={containerRef} className="absolute inset-0" aria-label="Map of places" role="region" />
      {error && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div>
            <MapPin className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
