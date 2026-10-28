/** @format */

import type { MagImage } from "./types";

// Page content is plain data; these read it safely whatever was stored.

export const str = (content: Record<string, unknown>, key: string) => {
  const value = content[key];
  return typeof value === "string" ? value : "";
};

export const bool = (content: Record<string, unknown>, key: string) => content[key] === true;

export const img = (content: Record<string, unknown>, key: string): MagImage | null => {
  const value = content[key] as MagImage | null | undefined;
  return value && typeof value === "object" && typeof value.src === "string" && value.src ? value : null;
};

export const list = (content: Record<string, unknown>, key: string): Record<string, unknown>[] => {
  const value = content[key];
  return Array.isArray(value) ? value.filter((v): v is Record<string, unknown> => !!v && typeof v === "object") : [];
};

// Every image path in a page's content, wherever the layout keeps it.
export const imageSources = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(imageSources);
  if (!value || typeof value !== "object") return [];
  const { src, ...rest } = value as Record<string, unknown>;
  return [...(typeof src === "string" && src ? [src] : []), ...Object.values(rest).flatMap(imageSources)];
};

// Text without the marks, e.g. for the contents page.
export const plainText = (text: string) =>
  text
    .replace(/^## /gm, "")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
