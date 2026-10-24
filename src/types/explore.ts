export type ApiExploreCategory = {
  id: number;
  name: string;
  slug: string;
  type?: string;
};

/**
 * Highlights, insider tips and "what to expect" are JSON columns: the admin
 * sends arrays, older rows hold a JSON string or plain text (see lib/explore-detail.ts).
 */
export type JsonListField = string | unknown[] | null;

/**
 * One row of the API's places table. Places to visit and businesses share it;
 * `type` tells them apart, and the site treats that like a category.
 */
export type ApiExploreItem = {
  id: number;
  type?: string;
  category_id?: number | string;
  name: string;
  slug: string;
  slug_active?: string;
  tagline?: string;
  short_description?: string;
  about?: string;
  highlights?: JsonListField;
  what_to_expect?: JsonListField;
  insider_tips?: JsonListField;
  featured_image?: string;
  gallery_images?: string[];
  address?: string | null;
  neighborhood?: string | null;
  phone?: string | null;
  email?: string | null;
  website_url?: string | null;
  hours?: string | null;
  fees?: string | null;
  parking?: string | null;
  best_time_to_visit?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  price_level?: string | null;
  rating?: string | number | null;
  review_count?: number;
  is_featured?: boolean;
  is_top_pick?: boolean;
  top_pick_rank?: number | null;
  is_active?: boolean;
  updated_at?: string;
  categories?: ApiExploreCategory[];
  similar_places?: ApiExploreItem[];
};
