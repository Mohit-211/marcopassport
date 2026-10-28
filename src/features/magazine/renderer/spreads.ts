/** @format */

import { plainText, str } from "./content";
import type { ContentsEntry, MagPage } from "./types";

// Page indexes (0-based) grouped as a printed magazine opens: the cover on its
// own on the right, then facing pairs, and a last left-hand page on its own.
export const toSpreads = (pageCount: number): number[][] => {
  if (pageCount === 0) return [];
  const spreads: number[][] = [[0]];
  for (let i = 1; i < pageCount; i += 2) spreads.push(i + 1 < pageCount ? [i, i + 1] : [i]);
  return spreads;
};

export const spreadIndexOf = (pageIndex: number) => (pageIndex === 0 ? 0 : Math.floor((pageIndex + 1) / 2));

// Stories that open on a page get a line on the contents page, unless the
// editor left them out. Their headline is the title.
const LISTED_LAYOUTS = new Set(["letter", "feature", "article", "gallery", "guide", "photo"]);

export const contentsEntries = (pages: MagPage[]): ContentsEntry[] =>
  pages.flatMap((page, index) => {
    if (!LISTED_LAYOUTS.has(page.layout) || page.content.hide_from_contents === true) return [];
    const title = str(page.content, "headline").trim();
    if (!title) return [];
    return [
      {
        pageNumber: index + 1,
        kicker: str(page.content, "kicker").trim(),
        title,
        description: plainText(str(page.content, "dek")),
      },
    ];
  });
