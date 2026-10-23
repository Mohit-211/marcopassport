"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  setCookieChoice,
  shouldShowCookieBanner,
  subscribeCookieChoice,
} from "@/lib/consent";

/**
 * Asks once whether the site may keep its essential data on this device; see
 * lib/consent.ts for what each answer does. Bottom-left on larger screens, so
 * it doesn't sit on the floating Passport button.
 */
export function CookieBanner() {
  // The answer lives in the browser, so the server never renders the banner.
  const open = useSyncExternalStore(
    subscribeCookieChoice,
    shouldShowCookieBanner,
    () => false,
  );
  if (!open) return null;

  return (
    <section
      aria-label="Cookie choice"
      className="fixed inset-x-4 bottom-4 z-(--z-banner) rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-elegant sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md"
    >
      <p className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
        <Cookie className="h-4 w-4 text-gold" aria-hidden />
        Cookies
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        We only use essential cookies and similar storage: they keep you signed
        in and remember the places you save. No ads, no tracking. If you reject
        them, we&apos;ll forget both when you close this tab.{" "}
        <Link
          href="/privacy#cookies"
          className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-gold"
        >
          Privacy policy
        </Link>
      </p>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" size="sm" onClick={() => setCookieChoice("rejected")}>
          Reject cookies
        </Button>
        <Button variant="gold" size="sm" onClick={() => setCookieChoice("essential")}>
          Accept all essential cookies
        </Button>
      </div>
    </section>
  );
}
