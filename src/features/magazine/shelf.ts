import { cache } from "react";
import { getMagazineApi, getMagazinesApi } from "@/api/users/magazine.api";
import { isNotFoundError } from "@/errors/apiError";
import { toMagazineIssue, type MagazineIssue } from "./model";
import { SAMPLE_ISSUES } from "./samples";

export interface MagazineShelf {
  /** Newest first */
  issues: MagazineIssue[];
  featured: MagazineIssue;
}

const SHELF_LIMIT = 50;

/**
 * Published issues with their pages. Covers are drawn from each issue's first
 * page, which the list doesn't include, so every issue is fetched whole. Empty
 * when nothing is published or the API can't be reached.
 */
async function publishedIssues(): Promise<MagazineIssue[]> {
  try {
    const list = await getMagazinesApi({ limit: SHELF_LIMIT });
    const featuredSlug = list?.featured?.slug ?? null;
    const issues = await Promise.allSettled((list?.magazines ?? []).map((m) => getMagazineApi(m.slug)));
    return issues.flatMap((result) => {
      if (result.status === "rejected") {
        console.error("Failed to fetch a magazine issue:", result.reason);
        return [];
      }
      return result.value ? [toMagazineIssue(result.value, featuredSlug)] : [];
    });
  } catch (error) {
    console.error("Failed to fetch magazine issues:", error);
    return [];
  }
}

/**
 * Every issue the magazine shows, newest first, and the featured one. While
 * no issue is published (or the API is down) the sample issues stand in.
 */
export const getMagazineShelf = cache(async (): Promise<MagazineShelf> => {
  const published = await publishedIssues();
  const issues = published.length > 0 ? published : SAMPLE_ISSUES;
  return { issues, featured: issues.find((issue) => issue.featured) ?? issues[0] };
});

/**
 * One issue by its slug, or undefined for a 404. It comes from the shelf when
 * it's there, so a sample issue answers only while the samples stand in, and
 * its address stops working once real issues are published. Older issues
 * past the shelf's limit are fetched on their own; API failures other than a
 * 404 throw, to show the error page.
 */
export const getMagazineIssue = cache(async (slug: string): Promise<MagazineIssue | undefined> => {
  const { issues } = await getMagazineShelf();
  const onShelf = issues.find((issue) => issue.slug === slug);
  if (onShelf) return onShelf;
  try {
    const issue = await getMagazineApi(slug);
    return issue ? toMagazineIssue(issue) : undefined;
  } catch (error) {
    if (isNotFoundError(error)) return undefined;
    throw error;
  }
});
