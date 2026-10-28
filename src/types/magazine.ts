import type { MagPage } from "@/features/magazine/renderer/types";

/** An issue as GET /magazine lists it (backend docs/frontend-handoff.md §5). */
export interface ApiMagazine {
  id: number;
  title: string;
  slug: string;
  issue_label: string | null;
  season: string | null;
  /** YYYY-MM-DD */
  publish_date: string | null;
  masthead: string | null;
  tagline: string | null;
  description: string | null;
  /** Page 1's photo: a path on the API host or a full URL */
  cover_image: string | null;
  page_count: number;
  is_featured: boolean;
}

/** GET /magazine: published issues, newest first */
export interface ApiMagazineList {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  magazines: ApiMagazine[];
  /** The issue the admin featured, else the newest */
  featured: ApiMagazine | null;
}

/** GET /magazine/:slug: the issue with its pages */
export interface ApiMagazineIssue extends ApiMagazine {
  pages: MagPage[];
}
