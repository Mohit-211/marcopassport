/** @format */

// A magazine issue is an ordered list of pages; each page is one of a fixed
// set of layouts filled with content. The admin edits this data and the site
// renders it with the same components, so pages look the same in both.
//
// This folder (src/magazine) has no admin imports on purpose: it can be
// copied into the public site as is.

// A photo on a page: the path on the API host, and the point to keep in view
// when the frame crops it (percentages; 50/50 is the centre).
export interface MagImage {
  src: string;
  focusX?: number;
  focusY?: number;
  alt?: string;
}

export type LayoutId =
  | "cover"
  | "contents"
  | "letter"
  | "feature"
  | "article"
  | "text"
  | "quote"
  | "photo"
  | "gallery"
  | "guide"
  | "ad_half"
  | "ad_cards"
  | "image_page"
  | "back";

export interface MagPage {
  // Stable id for editing (reordering, selection); not shown anywhere.
  id: string;
  layout: LayoutId;
  content: Record<string, unknown>;
}

// Issue details pages draw on (masthead, issue label, season).
export interface MagIssueMeta {
  title: string;
  masthead: string;
  issue_label: string;
  season: string;
}

// A contents-page line, worked out from the issue's pages.
export interface ContentsEntry {
  pageNumber: number;
  kicker: string;
  title: string;
  description: string;
}

export interface RenderContext {
  issue: MagIssueMeta;
  // 1 = the cover.
  pageNumber: number;
  // "edit" shows placeholders for empty slots; "read" hides them.
  mode: "edit" | "read";
  // Full URL for an image path from the API.
  resolveImage: (src: string) => string;
  contents: ContentsEntry[];
  // In the reader: opens a page (0-based), e.g. from the contents page.
  goToPage?: (pageIndex: number) => void;
  // In the reader: where the page with this id is (-1 if it's gone), for
  // links between pages of an imported PDF.
  pageIndexOf?: (id: string) => number;
}
