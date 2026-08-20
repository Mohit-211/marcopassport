export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
};

export type Blog = {
  id: number;
  category_id?: number;
  title: string;
  slug: string;
  description: string;
  content?: string;
  featured_image?: string;
  written_by?: string;
  read_time_minutes?: number;
  is_featured?: boolean;
  published_at?: string;
  updated_at?: string;
  blog_category?: BlogCategory;
};
