import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMagazineApi, getMagazinesApi } from "@/api/users/magazine.api";
import { SAMPLE_ISSUES } from "./samples";
import { getMagazineIssue, getMagazineShelf } from "./shelf";
import type { ApiMagazine, ApiMagazineIssue, ApiMagazineList } from "@/types/magazine";

vi.mock("@/api/users/magazine.api", () => ({ getMagazinesApi: vi.fn(), getMagazineApi: vi.fn() }));

const listApi = vi.mocked(getMagazinesApi);
const issueApi = vi.mocked(getMagazineApi);

const summary = (slug: string): ApiMagazine => ({
  id: slug.length,
  title: slug,
  slug,
  issue_label: null,
  season: null,
  publish_date: "2026-10-01",
  masthead: "Travelers",
  tagline: null,
  description: null,
  cover_image: null,
  page_count: 2,
  is_featured: false,
});

const list = (slugs: string[], featured: string | null = null): ApiMagazineList => ({
  total: slugs.length,
  page: 1,
  limit: 50,
  total_pages: 1,
  magazines: slugs.map(summary),
  featured: featured ? summary(featured) : null,
});

const withPages = (slug: string): ApiMagazineIssue => ({
  ...summary(slug),
  pages: [
    { id: `${slug}-1`, layout: "image_page", content: { image: { src: "/images/1.jpg" } } },
    { id: `${slug}-2`, layout: "image_page", content: { image: { src: "/images/2.jpg" } } },
  ],
});

const notFound = () => Object.assign(new Error("Issue not found."), { response: { status: 404 } });

const logged = () => vi.mocked(console.error).mock.calls.map(([message]) => message);

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("getMagazineShelf", () => {
  it("shows the published issues, featuring the one the API features", async () => {
    listApi.mockResolvedValue(list(["fall", "summer"], "summer"));
    issueApi.mockImplementation(async (slug) => withPages(slug));

    const shelf = await getMagazineShelf();
    expect(shelf.issues.map((issue) => issue.slug)).toEqual(["fall", "summer"]);
    expect(shelf.featured.slug).toBe("summer");
    expect(shelf.issues.every((issue) => !issue.sample)).toBe(true);
  });

  it("features the newest issue when none is featured", async () => {
    listApi.mockResolvedValue(list(["fall", "summer"]));
    issueApi.mockImplementation(async (slug) => withPages(slug));
    expect((await getMagazineShelf()).featured.slug).toBe("fall");
  });

  it("skips an issue that can't be loaded and keeps the rest", async () => {
    listApi.mockResolvedValue(list(["fall", "summer"]));
    issueApi.mockImplementation(async (slug) => {
      if (slug === "fall") throw notFound();
      return withPages(slug);
    });
    expect((await getMagazineShelf()).issues.map((issue) => issue.slug)).toEqual(["summer"]);
    expect(logged()).toEqual(["Failed to fetch a magazine issue:"]);
  });

  it("shows the sample issues while nothing is published", async () => {
    listApi.mockResolvedValue(list([]));
    const shelf = await getMagazineShelf();
    expect(shelf.issues).toBe(SAMPLE_ISSUES);
    expect(shelf.featured.featured).toBe(true);
    expect(issueApi).not.toHaveBeenCalled();
  });

  it("shows the sample issues when the API can't be reached", async () => {
    listApi.mockRejectedValue(new Error("Network Error"));
    expect((await getMagazineShelf()).issues).toBe(SAMPLE_ISSUES);
    expect(logged()).toEqual(["Failed to fetch magazine issues:"]);
  });
});

describe("getMagazineIssue", () => {
  it("finds an issue on the shelf without fetching it again", async () => {
    listApi.mockResolvedValue(list(["fall"]));
    issueApi.mockImplementation(async (slug) => withPages(slug));

    expect((await getMagazineIssue("fall"))?.pages).toHaveLength(2);
    expect(issueApi).toHaveBeenCalledTimes(1);
  });

  it("opens a sample issue only while the samples are on the shelf", async () => {
    const slug = SAMPLE_ISSUES[0].slug;
    listApi.mockResolvedValue(list([]));
    expect((await getMagazineIssue(slug))?.sample).toBe(true);

    listApi.mockResolvedValue(list(["fall"]));
    issueApi.mockImplementation(async (s) => {
      if (s === "fall") return withPages(s);
      throw notFound();
    });
    expect(await getMagazineIssue(slug)).toBeUndefined();
  });

  it("is undefined for an unknown issue, and passes on other errors", async () => {
    listApi.mockResolvedValue(list([]));
    issueApi.mockRejectedValue(notFound());
    expect(await getMagazineIssue("no-such-issue")).toBeUndefined();

    issueApi.mockRejectedValue(new Error("Network Error"));
    await expect(getMagazineIssue("no-such-issue")).rejects.toThrow("Network Error");
  });
});
