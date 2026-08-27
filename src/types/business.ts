export type ApiBusinessCategory = {
  id: number;
  name: string;
  slug: string;
  type?: string;
};

export type ApiBusiness = {
  category_id?: string | number;
  is_in_passport: boolean;
  id: number;
  name: string;
  slug: string;
  slug_active?: string;
  type?: string;
  categories?: ApiBusinessCategory[];
  tagline?: string;
  short_description?: string;
  about?: string;
  address?: string;
  neighborhood?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  hours?: string;
  fees?: string | null;
  parking?: string | null;
  best_time_to_visit?: string | null;
  insider_tips?: string | null;
  what_to_expect?: string | null;
  price_level?: string | null;
  rating?: number | null;
  review_count?: number;
  featured_image?: string;
  gallery_images?: string[];
  highlights?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_featured?: boolean;
  is_top_pick?: boolean;
  top_pick_rank?: number | null;
  is_active?: boolean;
  similar_places?: ApiBusiness[];
};

export type PlacesResponse = {
  total?: number;
  page?: number;
  limit?: number;
  total_pages?: number;
  places?: ApiBusiness[];
};
