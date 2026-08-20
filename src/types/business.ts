export type ApiBusinessCategory = {
  id: number;
  name: string;
  slug: string;
  type?: string;
};

export type ApiBusiness = {
  is_in_passport: boolean;
  id: number;
  name: string;
  slug: string;
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
  price_level?: string;
  rating?: number | null;
  review_count?: number;
  featured_image?: string;
  gallery_images?: string[];
  highlights?: string;
  is_featured?: boolean;
  is_top_pick?: boolean;
  similar_places?: ApiBusiness[];
};

export type PlacesResponse = {
  total?: number;
  page?: number;
  limit?: number;
  total_pages?: number;
  places?: ApiBusiness[];
};
