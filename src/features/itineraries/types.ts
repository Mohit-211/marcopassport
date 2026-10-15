/** Shapes returned by /user/itineraries (see backend docs/frontend-handoff.md §3). */

/** The place fields an itinerary needs; list responses only carry id, name, slug, featured_image. */
export interface ItineraryPlace {
  id: number;
  type?: "place" | "business";
  name: string;
  slug: string;
  short_description?: string | null;
  featured_image?: string | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export interface ItineraryItem {
  id?: number;
  place_id: number;
  position?: number;
  /** YYYY-MM-DD */
  visit_date: string | null;
  place: ItineraryPlace;
}

export interface Itinerary {
  id: number;
  user_id?: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
  created_at?: string;
  updated_at?: string;
  item_count: number;
  items: ItineraryItem[];
}

/** What the editor works on: a saved itinerary or the guest's local draft. */
export interface ItineraryDraft {
  name: string;
  start_date: string | null;
  end_date: string | null;
  items: ItineraryItem[];
}

/** Body for POST /user/itineraries and PUT /user/itineraries/:id */
export interface ItineraryPayload {
  name?: string;
  start_date?: string | null;
  end_date?: string | null;
  items?: Array<{ place_id: number; visit_date: string | null }>;
}

export const MAX_ITINERARY_PLACES = 20;
export const DEFAULT_ITINERARY_NAME = "My passport";
