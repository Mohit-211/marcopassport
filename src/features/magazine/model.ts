import { plainText, str } from "./renderer/content";
import { contentsEntries } from "./renderer/spreads";
import type { ContentsEntry, MagIssueMeta, MagPage } from "./renderer/types";
import type { ApiMagazineIssue } from "@/types/magazine";

/**
 * One issue as the site shows it: its details, its pages (drawn by
 * ./renderer, the admin builder's own renderer) and what's worked out from
 * them.
 */
export interface MagazineIssue {
  slug: string;
  title: string;
  /** The name across the cover, e.g. "Marco" */
  masthead: string;
  /** e.g. "Issue 07"; empty when not set */
  issueLabel: string;
  /** e.g. "Fall 2026"; empty when not set */
  season: string;
  /** YYYY-MM-DD; empty when not set */
  publishDate: string;
  tagline: string;
  description: string;
  featured: boolean;
  pages: MagPage[];
  /** The stories its contents page lists */
  contents: ContentsEntry[];
  /** The editor's letter as plain paragraphs; empty when there's none */
  letter: string[];
  /** One of the sample issues that stand in while none are published */
  sample: boolean;
}

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

/** "October 2026" for 2026-10-29; empty for a missing or malformed date. */
export function formatIssueDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? "" : MONTH_YEAR.format(parsed);
}

/** "Issue 07 · Fall 2026", from whichever of the two the issue has. */
export function issueLine(issue: Pick<MagazineIssue, "issueLabel" | "season">) {
  return [issue.issueLabel, issue.season].filter(Boolean).join(" · ");
}

/** What pages draw on: masthead, issue label and season. */
export function issueMeta(issue: MagazineIssue): MagIssueMeta {
  return { title: issue.title, masthead: issue.masthead, issue_label: issue.issueLabel, season: issue.season };
}

/**
 * Full URL for an image in an issue. API paths ("/images/…") get the image
 * host; full URLs (photos picked from Explore) and the site's own assets (the
 * sample issues) are used as they are.
 */
export function magazineImage(src: string) {
  if (/^https?:\/\//.test(src) || src.startsWith("/assets/")) return src;
  return `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${src}`;
}

/** The first letter page's body as plain paragraphs. */
export function letterOf(pages: MagPage[]) {
  const page = pages.find((p) => p.layout === "letter");
  if (!page) return [];
  return str(page.content, "body")
    .split(/\n\s*\n/)
    .map((paragraph) => plainText(paragraph.replace(/^## .*$/gm, "")))
    .filter(Boolean);
}

const isPage = (value: unknown): value is MagPage => {
  if (!value || typeof value !== "object") return false;
  const page = value as Record<string, unknown>;
  return typeof page.id === "string" && typeof page.layout === "string" && !!page.content && typeof page.content === "object";
};

/** An issue from the API. `featuredSlug` is the shelf's featured issue, when known. */
export function toMagazineIssue(api: ApiMagazineIssue, featuredSlug?: string | null): MagazineIssue {
  const pages = Array.isArray(api.pages) ? api.pages.filter(isPage) : [];
  return {
    slug: api.slug,
    title: api.title,
    masthead: api.masthead?.trim() || "Marco",
    issueLabel: api.issue_label?.trim() ?? "",
    season: api.season?.trim() ?? "",
    publishDate: api.publish_date ?? "",
    tagline: api.tagline?.trim() ?? "",
    description: api.description?.trim() ?? "",
    featured: featuredSlug ? api.slug === featuredSlug : Boolean(api.is_featured),
    pages,
    contents: contentsEntries(pages),
    letter: letterOf(pages),
    sample: false,
  };
}

/**
 * The issue with only its first page: what a cover needs. Covers are client
 * components, so this keeps every other page out of what the browser loads.
 */
export function coverOnly(issue: MagazineIssue): MagazineIssue {
  return { ...issue, pages: issue.pages.slice(0, 1), contents: [], letter: [] };
}
