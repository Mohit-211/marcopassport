import type { ReactNode } from "react";

import type { ItineraryEntry } from "@/types/trip";
import type { RouteTravelMode } from "../map/types";

/** What the dashboard shows for one stop, whatever data source it came from. */
export interface DashboardItem {
  name: string;
  image: string;
  /** Secondary line under the name, e.g. "Beach · $$" */
  subtitle: string;
  lat: number | null;
  lng: number | null;
}

export type EntryPatch = Partial<Pick<ItineraryEntry, "time" | "notes">>;

/**
 * Everything TripDashboard needs from the page that hosts it. The /plan
 * planner and My Trips each build one, so the same UI works on both.
 * Leave an action out when the data source can't do it; its control is hidden.
 */
export interface TripDashboardController {
  /** Looks up an entry's `itemId` */
  getItem: (itemId: string) => DashboardItem | undefined;

  /** Controlled day selection; when omitted the dashboard keeps its own */
  selectedDay?: string | null;
  setSelectedDay?: (day: string) => void;

  /** Show travelers and group type under "My Plan" */
  showTravelers?: boolean;
  /** Mention that guest trips only live in this browser */
  showGuestNotice?: boolean;
  /** Draw the real road route; otherwise a straight line joins the stops */
  routeMode?: RouteTravelMode;

  /** Other trips to switch to from the "My Plan" heading */
  trips?: Array<{ id: string; name: string }>;
  onSwitchTrip?: (tripId: string) => void;

  onEdit?: () => void;
  onShare?: () => void;
  onNewTrip?: () => void;
  /** Called after the user confirms; return false to keep the dialog's toast quiet */
  onDelete?: () => void | boolean | Promise<void | boolean>;

  onAddStop?: (day: string) => void;
  onRemoveEntry?: (day: string, entryId: string) => void;
  /** Reorder within a day */
  onMoveEntry?: (day: string, from: number, to: number) => void;
  /** Time and notes */
  onUpdateEntry?: (day: string, entryId: string, patch: EntryPatch) => void;
  onMoveEntryToDay?: (fromDay: string, entryId: string, toDay: string) => void;

  /** Extra content under the selected day's itinerary, e.g. suggestions */
  renderSelectedDayExtras?: (day: string) => ReactNode;
}
