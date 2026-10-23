/**
 * A website as typed in the admin ("www.marcofun.com", "marcofun.com/rentals")
 * as an absolute link. Without the scheme, an href is relative to the current
 * page and lands on a 404. Returns null for an empty value.
 */
export function toExternalUrl(value: string | null | undefined): string | null {
  const url = value?.trim();
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `https://${url}`;
}
