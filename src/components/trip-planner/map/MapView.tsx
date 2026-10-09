"use client";

import { useEffect, useState } from "react";

import { GOOGLE_MAPS_API_KEY } from "@/lib/trip-planner/google-maps";
import { GoogleMap } from "./GoogleMap";
import { PreviewMap } from "./PreviewMap";
import type { MapViewProps } from "./types";

export type { MapPoint, MapViewProps, RouteStatus, RouteTravelMode } from "./types";

/** Google map when a key is configured, otherwise (or on failure) a simple preview. */
export function MapView(props: MapViewProps) {
  const [failed, setFailed] = useState(false);
  const usingPreview = !GOOGLE_MAPS_API_KEY || failed;
  const { travelMode, onRouteStatus } = props;

  // The preview can't route, so say so instead of drawing a fake line
  useEffect(() => {
    if (usingPreview && travelMode) {
      onRouteStatus?.({ state: "error", message: "Live directions need the Google map, which isn't available right now." });
    }
  }, [usingPreview, travelMode, onRouteStatus]);

  return (
    <div className={props.className}>
      {GOOGLE_MAPS_API_KEY && !failed ? (
        <GoogleMap {...props} onError={() => setFailed(true)} />
      ) : (
        <PreviewMap
          {...props}
          notice={
            failed
              ? "We couldn't load Google Maps right now, so you're seeing a simplified map. Your plan still works as usual."
              : "Map preview. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to show the live Google map."
          }
        />
      )}
    </div>
  );
}
