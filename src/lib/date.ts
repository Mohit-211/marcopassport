/**
 * "2026-10-23T07:30" → "7:30 AM". Open-Meteo sends sunrise and sunset as the
 * island's wall-clock time with no offset; parsing that with Date would read
 * it in the server's timezone and shift it, so the digits are used as given.
 */
export function formatTime(dateString: string) {
  const match = /T(\d{1,2}):(\d{2})/.exec(dateString);
  if (!match) return "";
  const hours = Number(match[1]);
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${match[2]} ${period}`;
}
