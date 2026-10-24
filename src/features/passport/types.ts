/** Shapes returned by /user/passports (see backend docs/frontend-handoff.md §3). */

/** The place fields a passport needs; list responses only carry id, name, slug, featured_image. */
export interface PassportPlace {
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

export interface PassportItem {
  id?: number;
  place_id: number;
  position?: number;
  /** YYYY-MM-DD */
  visit_date: string | null;
  place: PassportPlace;
}

export interface Passport {
  id: number;
  user_id?: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
  created_at?: string;
  updated_at?: string;
  item_count: number;
  items: PassportItem[];
}

/** What the editor works on: a saved passport or the guest's local draft. */
export interface PassportDraft {
  name: string;
  start_date: string | null;
  end_date: string | null;
  items: PassportItem[];
}

/** Body for POST /user/passports and PUT /user/passports/:id */
export interface PassportPayload {
  name?: string;
  start_date?: string | null;
  end_date?: string | null;
  items?: Array<{ place_id: number; visit_date: string | null }>;
}

export const MAX_PASSPORT_PLACES = 20;
export const DEFAULT_PASSPORT_NAME = "My passport";
