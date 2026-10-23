"use client";

import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCookieSettings } from "@/lib/consent";

/** Brings the cookie banner back so the visitor can change their answer. */
export function CookieSettingsButton() {
  return (
    <Button variant="outline" size="sm" onClick={openCookieSettings}>
      <Cookie className="h-4 w-4" aria-hidden />
      Change your cookie choice
    </Button>
  );
}
