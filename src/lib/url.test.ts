import { describe, expect, it } from "vitest";
import { toExternalUrl } from "./url";

describe("toExternalUrl", () => {
  it("adds https:// to a website typed without it", () => {
    expect(toExternalUrl("www.marcofun.com")).toBe("https://www.marcofun.com");
    expect(toExternalUrl(" marcofun.com/rentals ")).toBe("https://marcofun.com/rentals");
    expect(toExternalUrl("//marcofun.com")).toBe("https://marcofun.com");
  });

  it("leaves full links alone", () => {
    expect(toExternalUrl("https://bigmarcoboatrentals.com/")).toBe("https://bigmarcoboatrentals.com/");
    expect(toExternalUrl("http://example.org")).toBe("http://example.org");
  });

  it("returns null when there's no website", () => {
    expect(toExternalUrl("")).toBeNull();
    expect(toExternalUrl("   ")).toBeNull();
    expect(toExternalUrl(null)).toBeNull();
    expect(toExternalUrl(undefined)).toBeNull();
  });
});
