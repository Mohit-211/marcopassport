import { afterEach, describe, expect, it, vi } from "vitest";
import { coverOnly, formatIssueDate, issueLine, letterOf, magazineImage, toMagazineIssue } from "./model";
import type { MagPage } from "./renderer/types";
import type { ApiMagazineIssue } from "@/types/magazine";

const page = (id: string, layout: MagPage["layout"], content: Record<string, unknown> = {}): MagPage => ({ id, layout, content });

const apiIssue = (overrides: Partial<ApiMagazineIssue> = {}): ApiMagazineIssue => ({
  id: 1,
  title: "Coastal Escapes",
  slug: "coastal-escapes",
  issue_label: " Issue 06 ",
  season: "Summer 2026",
  publish_date: "2026-06-01",
  masthead: "Marco",
  tagline: "A slow guide",
  description: "The summer edition.",
  cover_image: "/images/cover.jpg",
  page_count: 2,
  is_featured: false,
  pages: [page("p1", "cover", { headline: "Cover" }), page("p2", "feature", { headline: "Mangroves", kicker: "Nature" })],
  ...overrides,
});

describe("formatIssueDate", () => {
  it("shows the month and year", () => {
    expect(formatIssueDate("2026-10-29")).toBe("October 2026");
  });

  it("reads the date in UTC, so the first of the month never slips back a month", () => {
    expect(formatIssueDate("2026-10-01")).toBe("October 2026");
  });

  it("is empty for a missing or malformed date", () => {
    expect(formatIssueDate("")).toBe("");
    expect(formatIssueDate("October 2026")).toBe("");
    expect(formatIssueDate("2026-13-45")).toBe("");
  });
});

describe("issueLine", () => {
  it("joins the issue label and season", () => {
    expect(issueLine({ issueLabel: "Issue 07", season: "Fall 2026" })).toBe("Issue 07 · Fall 2026");
  });

  it("uses whichever of the two is set", () => {
    expect(issueLine({ issueLabel: "", season: "Fall 2026" })).toBe("Fall 2026");
    expect(issueLine({ issueLabel: "Issue 07", season: "" })).toBe("Issue 07");
    expect(issueLine({ issueLabel: "", season: "" })).toBe("");
  });
});

describe("magazineImage", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("puts API paths on the image host", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_URL", "https://api.example.com");
    expect(magazineImage("/images/magazine/cover.jpg")).toBe("https://api.example.com/images/magazine/cover.jpg");
  });

  it("keeps full URLs and the site's own assets as they are", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_URL", "https://api.example.com");
    expect(magazineImage("https://cdn.example.com/photo.jpg")).toBe("https://cdn.example.com/photo.jpg");
    expect(magazineImage("/assets/place-sunset.jpg")).toBe("/assets/place-sunset.jpg");
  });
});

describe("letterOf", () => {
  it("returns the letter's paragraphs as plain text, without headings", () => {
    const pages = [
      page("p1", "cover"),
      page("p2", "letter", { body: "## Hello\nWe made this for **long** days.\n\nRead it *slowly*.\n\n  \n" }),
    ];
    expect(letterOf(pages)).toEqual(["We made this for long days.", "Read it slowly."]);
  });

  it("is empty when the issue has no letter", () => {
    expect(letterOf([page("p1", "cover")])).toEqual([]);
  });
});

describe("toMagazineIssue", () => {
  it("trims the details and works out the contents and letter", () => {
    const issue = toMagazineIssue(apiIssue());
    expect(issue).toMatchObject({
      slug: "coastal-escapes",
      issueLabel: "Issue 06",
      season: "Summer 2026",
      publishDate: "2026-06-01",
      featured: false,
      letter: [],
      sample: false,
    });
    expect(issue.contents).toEqual([{ pageNumber: 2, kicker: "Nature", title: "Mangroves", description: "" }]);
  });

  it("fills in what the API left empty", () => {
    const issue = toMagazineIssue(
      apiIssue({ masthead: " ", issue_label: null, season: null, publish_date: null, tagline: null, description: null }),
    );
    expect(issue).toMatchObject({ masthead: "Marco", issueLabel: "", season: "", publishDate: "", tagline: "", description: "" });
  });

  it("drops malformed pages", () => {
    const pages = [page("p1", "cover"), null, { id: "p3", layout: "feature" }, page("p4", "back")] as unknown as MagPage[];
    expect(toMagazineIssue(apiIssue({ pages })).pages.map((p) => p.id)).toEqual(["p1", "p4"]);
    expect(toMagazineIssue(apiIssue({ pages: undefined as unknown as MagPage[] })).pages).toEqual([]);
  });

  it("is featured when it's the shelf's featured issue, else when the API says so", () => {
    expect(toMagazineIssue(apiIssue(), "coastal-escapes").featured).toBe(true);
    expect(toMagazineIssue(apiIssue({ is_featured: true }), "another-issue").featured).toBe(false);
    expect(toMagazineIssue(apiIssue({ is_featured: true })).featured).toBe(true);
  });
});

describe("coverOnly", () => {
  it("keeps just the cover, and leaves the issue as it was", () => {
    const issue = toMagazineIssue(apiIssue());
    const cover = coverOnly(issue);
    expect(cover.pages.map((p) => p.id)).toEqual(["p1"]);
    expect(cover.contents).toEqual([]);
    expect(cover.title).toBe(issue.title);
    expect(issue.pages).toHaveLength(2);
    expect(issue.contents).toHaveLength(1);
  });
});
