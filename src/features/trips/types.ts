/**
 * The one shape the rest of the app uses for anything that can be added to a
 * trip. Only `normalize.ts` knows about the raw Places / Business API shapes.
 */
export type ItemSource = "places" | "business";

export interface NormalizedItem {
  /** Stable key across both APIs, e.g. "places:12" — see `itemKey` */
  id: string;
  source: ItemSource;
  sourceId: string;
  slug: string;
  name: string;
  category: string;
  address: string;
  lat: number | null;
  lng: number | null;
  image: string;
  rating: number | null;
  phone: string | null;
  website: string | null;
  openingHours: string | null;
  description: string;
}

export interface Trip {
  id: string;
  userId: string | null;
  name: string;
  /** e.g. "Marco Island, FL" */
  location: string;
  /** yyyy-MM-dd */
  startDate: string;
  /** yyyy-MM-dd */
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripItem {
  id: string;
  tripId: string;
  source: ItemSource;
  sourceId: string;
  /** Copy of the item when it was saved, so trips survive the source API being down */
  normalizedSnapshot: NormalizedItem;
  /** 1-based day of the trip; null means Unscheduled */
  dayNumber: number | null;
  sortOrder: number;
  createdAt: string;
}

export interface TripWithItems extends Trip {
  items: TripItem[];
}

export interface TripInput {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
}
