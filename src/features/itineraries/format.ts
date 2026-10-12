import { format, parseISO } from "date-fns";

/** "Dec 1 – Dec 5, 2026", or a partial range, or "No dates yet". */
export function formatDateRange(start: string | null, end: string | null) {
  const fmt = (d: string, pattern: string) => format(parseISO(d), pattern);
  if (start && end) return `${fmt(start, "MMM d")} – ${fmt(end, "MMM d, yyyy")}`;
  if (start) return `From ${fmt(start, "MMM d, yyyy")}`;
  if (end) return `Until ${fmt(end, "MMM d, yyyy")}`;
  return "No dates yet";
}
