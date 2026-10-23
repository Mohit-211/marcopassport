"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/New_York",
});

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(timer);
}

const now = () => formatter.format(new Date());

/**
 * The time on Marco Island right now, kept ticking in the browser. The Local
 * Info page itself is cached for up to 30 minutes, so the server can't render
 * it; "—" shows until the page hydrates.
 */
export function LocalClock() {
  const time = useSyncExternalStore(subscribe, now, () => null);
  return <span>{time ?? "—"}</span>;
}
