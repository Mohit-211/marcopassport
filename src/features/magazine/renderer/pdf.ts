/** @format */

import type { MagPage } from "./types";

// A page made from a PDF is a full-page image page that keeps a little of the
// PDF in content.pdf: the page's shape, its links and its text.

// A clickable area, in percent of the page: a web, mail or phone link, or a
// link to another page of the issue (by page id, so it survives moves).
export interface PdfLinkArea {
  x: number;
  y: number;
  w: number;
  h: number;
  link?: string;
  page_id?: string;
}

export interface PdfPageData {
  // Width / height of the PDF page.
  ratio: number;
  // The page's words, for screen readers.
  text: string;
  links: PdfLinkArea[];
}

const num = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : null);

export const pdfPage = (content: Record<string, unknown>): PdfPageData | null => {
  const data = content.pdf;
  if (!data || typeof data !== "object") return null;
  const { ratio, text, links } = data as Record<string, unknown>;
  const r = num(ratio);
  if (!r || r <= 0) return null;
  return {
    ratio: Math.min(Math.max(r, 0.25), 4),
    text: typeof text === "string" ? text : "",
    links: (Array.isArray(links) ? links : []).flatMap((value) => {
      if (!value || typeof value !== "object") return [];
      const area = value as Record<string, unknown>;
      const [x, y, w, h] = [num(area.x), num(area.y), num(area.w), num(area.h)];
      if (x === null || y === null || !w || !h) return [];
      const link = typeof area.link === "string" ? area.link : undefined;
      const page_id = typeof area.page_id === "string" ? area.page_id : undefined;
      return link || page_id ? [{ x, y, w, h, link, page_id }] : [];
    }),
  };
};

// US Letter, the shape the layouts are designed for.
export const LETTER_RATIO = 17 / 22;

// The shape of an issue's pages: US Letter, unless every page is a full-page
// image and they came from a PDF. Then the book takes the PDF's shape (the
// middle value, so one odd page doesn't decide it).
export const pageRatio = (pages: MagPage[]) => {
  if (pages.some((p) => p.layout !== "image_page")) return LETTER_RATIO;
  const ratios = pages.flatMap((p) => pdfPage(p.content)?.ratio ?? []).sort((a, b) => a - b);
  if (!ratios.length) return LETTER_RATIO;
  return Math.min(Math.max(ratios[Math.floor(ratios.length / 2)], 0.5), 2);
};
