export type CategoryId =
  | "events"
  | "live-music"
  | "top-picks"
  | "dining"
  | "lodging"
  | "to-do"
  | "shopping"
  | "local-services"
  | "info";

/** "top-picks" is a flag on an item, not a category an item belongs to. */
export type ItemCategory = Exclude<CategoryId, "top-picks">;

export type Interest =
  | "beaches"
  | "dining"
  | "live-music"
  | "golf"
  | "boating-fishing"
  | "shopping"
  | "family-fun"
  | "arts-culture"
  | "nightlife"
  | "nature-wildlife"
  | "wellness";

/** 0 = free, 1–4 = $–$$$$ */
export type PriceLevel = 0 | 1 | 2 | 3 | 4;

export interface PlannerItem {
  id: string;
  name: string;
  category: ItemCategory;
  topPick?: boolean;
  interests: Interest[];
  /** yyyy-MM-dd, only for one-off events */
  date?: string;
  /** Suggested start time, "HH:mm" */
  time?: string;
  /** Human-readable hours or event time */
  hours: string;
  address: string;
  lat: number;
  lng: number;
  priceLevel: PriceLevel;
  description: string;
  image: string;
}

export type GroupType = "solo" | "couple" | "family" | "friends";
export type Budget = "low" | "medium" | "high";

export interface Travelers {
  adults: number;
  children: number;
  pets: number;
}

export interface TripDraft {
  destinations: string[];
  startDate: string | null;
  endDate: string | null;
  travelers: Travelers;
  groupType: GroupType | null;
  interests: Interest[];
  budget: Budget | null;
  name: string;
  /** True once the user types their own name, so we stop auto-suggesting */
  nameEdited: boolean;
}

export interface ItineraryEntry {
  id: string;
  itemId: string;
  /** "HH:mm" */
  time: string;
  notes: string;
}

export interface Trip {
  id: string;
  name: string;
  destinations: string[];
  /** yyyy-MM-dd */
  startDate: string;
  /** yyyy-MM-dd */
  endDate: string;
  travelers: Travelers;
  groupType: GroupType;
  interests: Interest[];
  budget: Budget | null;
  /** Keyed by yyyy-MM-dd; entries are kept sorted by time */
  days: Record<string, ItineraryEntry[]>;
  createdAt: string;
  updatedAt: string;
}
