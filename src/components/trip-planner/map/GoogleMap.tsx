"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LocateFixed } from "lucide-react";

import { MARCO_ISLAND_CENTER } from "@/data/trip-planner";
import {
  GOOGLE_MAPS_MAP_ID,
  MAPS_AUTH_FAILURE_EVENT,
  loadGoogleMaps,
} from "@/lib/trip-planner/google-maps";
import { MapControlButton, MapLoading, pinClassName } from "./map-parts";
import type { MapViewProps } from "./types";

interface Marker {
  marker: google.maps.marker.AdvancedMarkerElement;
  pin: HTMLElement;
}

function highlightMarker(
  map: google.maps.Map,
  markers: Map<string, Marker>,
  activeId: string | null | undefined,
) {
  for (const [id, { marker, pin }] of markers) {
    const active = id === activeId;
    pin.dataset.active = String(active);
    marker.zIndex = active ? 1000 : null;
    if (active && marker.position && !map.getBounds()?.contains(marker.position)) {
      map.panTo(marker.position);
    }
  }
}

export function GoogleMap({
  points,
  activeId,
  onSelect,
  showRoute,
  travelMode,
  centerOnActive,
  onRouteStatus,
  label,
  onError,
}: MapViewProps & { onError: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const routeRef = useRef<google.maps.Polyline | null>(null);
  const onSelectRef = useRef(onSelect);
  const onErrorRef = useRef(onError);
  const onRouteStatusRef = useRef(onRouteStatus);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
    onErrorRef.current = onError;
    onRouteStatusRef.current = onRouteStatus;
  });

  useEffect(() => {
    let cancelled = false;
    const fail = () => onErrorRef.current();
    window.addEventListener(MAPS_AUTH_FAILURE_EVENT, fail);

    loadGoogleMaps()
      .then(async () => {
        const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        await google.maps.importLibrary("marker");
        if (cancelled || !containerRef.current) return;
        mapRef.current = new Map(containerRef.current, {
          center: MARCO_ISLAND_CENTER,
          zoom: 13,
          mapId: GOOGLE_MAPS_MAP_ID,
          // Controls sit on the right, centred so the floating badge
          // (bottom-right) never covers them
          zoomControl: true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
          streetViewControl: true,
          streetViewControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
          // Map/satellite "layers" switch
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          },
          // Duplicates zoom
          cameraControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: "cooperative",
        });
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) fail();
      });

    return () => {
      cancelled = true;
      window.removeEventListener(MAPS_AUTH_FAILURE_EVENT, fail);
    };
  }, []);

  const fitToPoints = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    if (points.length === 0) {
      map.panTo(MARCO_ISLAND_CENTER);
      map.setZoom(13);
    } else if (points.length === 1) {
      map.panTo(points[0]);
      map.setZoom(15);
    } else {
      const bounds = new google.maps.LatLngBounds();
      points.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, 64);
    }
  }, [points]);

  // Draw pins and the route whenever the points change
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const markers = markersRef.current;

    for (const { marker } of markers.values()) marker.map = null;
    markers.clear();
    routeRef.current?.setMap(null);

    for (const point of points) {
      const pin = document.createElement("div");
      pin.className = pinClassName;
      pin.textContent = point.label ?? "";
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: point,
        content: pin,
        title: point.title,
        gmpClickable: true,
      });
      marker.addListener("click", () => onSelectRef.current?.(point.id));
      markers.set(point.id, { marker, pin });
    }

    if (showRoute && !travelMode && points.length > 1) {
      routeRef.current = new google.maps.Polyline({
        map,
        path: points,
        strokeColor: "#002946",
        strokeOpacity: 0.85,
        strokeWeight: 4,
        icons: [
          {
            icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 2.5 },
            offset: "50%",
            repeat: "120px",
          },
        ],
      });
    }

    fitToPoints();
  }, [ready, points, showRoute, fitToPoints]);

  // Real road route through the points, recalculated whenever they change
  const directionsRef = useRef<google.maps.Polyline | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !travelMode) return;
    let cancelled = false;
    directionsRef.current?.setMap(null);
    directionsRef.current = null;

    if (points.length < 2) {
      onRouteStatusRef.current?.({ state: "idle" });
      return;
    }
    onRouteStatusRef.current?.({ state: "loading" });

    (async () => {
      try {
        const { DirectionsService } = (await google.maps.importLibrary("routes")) as google.maps.RoutesLibrary;
        const result = await new DirectionsService().route({
          origin: points[0],
          destination: points[points.length - 1],
          // Directions allows at most 25 intermediate stops
          waypoints: points.slice(1, -1).slice(0, 25).map((p) => ({ location: p, stopover: true })),
          travelMode: google.maps.TravelMode[travelMode],
        });
        const route = result.routes[0];
        if (cancelled || !route) return;
        directionsRef.current = new google.maps.Polyline({
          map,
          path: route.overview_path,
          strokeColor: "#002946",
          strokeOpacity: 0.9,
          strokeWeight: 5,
          icons: [
            {
              icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW, scale: 2.5, strokeColor: "#EBBD00" },
              offset: "40px",
              repeat: "110px",
            },
          ],
        });
        const legs = route.legs ?? [];
        onRouteStatusRef.current?.({
          state: "ready",
          distanceMeters: legs.reduce((sum, l) => sum + (l.distance?.value ?? 0), 0),
          durationSeconds: legs.reduce((sum, l) => sum + (l.duration?.value ?? 0), 0),
        });
      } catch (err) {
        if (cancelled) return;
        const code = (err as { code?: string })?.code;
        onRouteStatusRef.current?.({
          state: "error",
          message:
            code === "REQUEST_DENIED"
              ? "Route directions aren't enabled for this Google Maps key (enable the Directions API)."
              : "We couldn't calculate a route between these stops.",
        });
      }
    })();

    return () => {
      cancelled = true;
      directionsRef.current?.setMap(null);
      directionsRef.current = null;
    };
  }, [ready, points, travelMode]);

  // Highlight the active pin and bring it into view
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    highlightMarker(mapRef.current, markersRef.current, activeId);
    const position = activeId && centerOnActive ? markersRef.current.get(activeId)?.marker.position : null;
    if (position) mapRef.current.panTo(position);
  }, [activeId, ready, points, centerOnActive]);

  return (
    <div className="relative h-full w-full" role="region" aria-label={label}>
      <div ref={containerRef} className="h-full w-full" />
      {!ready && <MapLoading />}
      {ready && (
        <div className="absolute left-3 top-3">
          <MapControlButton label="Recenter map" onClick={fitToPoints}>
            <LocateFixed className="size-4" />
          </MapControlButton>
        </div>
      )}
    </div>
  );
}
