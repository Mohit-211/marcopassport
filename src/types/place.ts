export type ApiPlaceCategory = {
  id: number;
  name: string;
  slug: string;
  type?: string;
};

export type ApiPlace = {
  category_id: number;
  id: number;
  type?: string;
  name: string;
  slug: string;
  slug_active?: string;
  short_description?: string;
  about?: string;
  highlights?: string | null;
  what_to_expect?: string | null;
  insider_tips?: string | null;
  featured_image?: string;
  gallery_images?: string[];
  address?: string;
  phone?: string | null;
  email?: string | null;
  hours?: string | null;
  fees?: string | null;
  parking?: string | null;
  best_time_to_visit?: string | null;
  website_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price_level?: string | null;
  neighborhood?: string | null;
  rating?: string | number | null;
  review_count?: number;
  is_featured?: boolean;
  is_top_pick?: boolean;
  top_pick_rank?: number | null;
  is_active?: boolean;
  is_in_passport?: boolean;
  updated_at?: string;
  categories?: ApiPlaceCategory[];
  similar_places?: ApiPlace[];
};

export type ApiPlacesListResponse = {
  total?: number;
  page?: number;
  limit?: number;
  total_pages?: number;
  places?: ApiPlace[];
};
