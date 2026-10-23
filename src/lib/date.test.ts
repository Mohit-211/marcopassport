import { describe, expect, it } from "vitest";
import { formatTime } from "./date";

describe("formatTime", () => {
  it("formats Open-Meteo's wall-clock time as given, whatever the server's timezone", () => {
    expect(formatTime("2026-10-23T07:30")).toBe("7:30 AM");
    expect(formatTime("2026-10-23T18:51")).toBe("6:51 PM");
  });

  it("handles noon and midnight", () => {
    expect(formatTime("2026-10-23T12:05")).toBe("12:05 PM");
    expect(formatTime("2026-10-23T00:05")).toBe("12:05 AM");
  });

  it("returns nothing for a value without a time", () => {
    expect(formatTime("")).toBe("");
    expect(formatTime("2026-10-23")).toBe("");
  });
});
