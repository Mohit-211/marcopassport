import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { imageSources } from "./renderer/content";
import { SAMPLE_ISSUES } from "./samples";

describe("SAMPLE_ISSUES", () => {
  it("lists issues newest first, with exactly one featured", () => {
    const dates = SAMPLE_ISSUES.map((issue) => issue.publishDate);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(SAMPLE_ISSUES.filter((issue) => issue.featured)).toHaveLength(1);
  });

  it("gives every issue and page its own id", () => {
    const slugs = SAMPLE_ISSUES.map((issue) => issue.slug);
    const pageIds = SAMPLE_ISSUES.flatMap((issue) => issue.pages.map((p) => p.id));
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(pageIds).size).toBe(pageIds.length);
  });

  it.each(SAMPLE_ISSUES.map((issue) => [issue.slug, issue] as const))(
    "%s is bound like a printed issue: cover first, back cover last, an even number of pages",
    (_, issue) => {
      expect(issue.pages[0].layout).toBe("cover");
      expect(issue.pages.at(-1)?.layout).toBe("back");
      expect(issue.pages.length % 2).toBe(0);
    },
  );

  it.each(SAMPLE_ISSUES.map((issue) => [issue.slug, issue] as const))("%s has a letter and a contents page to fill", (_, issue) => {
    expect(issue.letter.length).toBeGreaterThan(0);
    expect(issue.contents.length).toBeGreaterThan(0);
    expect(issue.sample).toBe(true);
  });

  it("only uses photos the site ships", () => {
    const sources = SAMPLE_ISSUES.flatMap((issue) => issue.pages.flatMap((p) => imageSources(p.content)));
    expect(sources.length).toBeGreaterThan(0);
    const missing = sources.filter((src) => !src.startsWith("/assets/") || !existsSync(path.join("public", src)));
    expect(missing).toEqual([]);
  });
});
