export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  /** Short text shown inside the pin, e.g. the stop number */
  label?: string;
}

export type RouteTravelMode = "DRIVING" | "WALKING";

export type RouteStatus =
  | { state: "idle" | "loading" }
  | { state: "ready"; distanceMeters: number; durationSeconds: number }
  | { state: "error"; message: string };

export interface MapViewProps {
  /** Memoize this array; the map redraws its pins whenever it changes. */
  points: MapPoint[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  /** Connect the points in order with a route line */
  showRoute?: boolean;
  /**
   * Draw the real road route between the points (Google Directions) instead of
   * a straight line. Nothing is drawn if routing fails; see onRouteStatus.
   */
  travelMode?: RouteTravelMode;
  /** Always centre the map on the active point, not only when it is off-screen */
  centerOnActive?: boolean;
  onRouteStatus?: (status: RouteStatus) => void;
  /** Accessible name for the map region */
  label: string;
  className?: string;
}
