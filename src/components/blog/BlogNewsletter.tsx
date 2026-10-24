"use client";

import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/site/CtaSection";
import { useNewsletterSignup } from "@/hooks/useNewsletterSignup";

export default function BlogNewsletter() {
  const newsletter = useNewsletterSignup("blog");

  return (
    <CtaSection
      eyebrow="The Dispatch"
      title="New blogs and island tips, delivered monthly."
      description="Be the first to hear about our best guides, new openings and quiet recommendations, straight from Marco Island."
      aside={
        newsletter.status === "done" ? (
          <p role="status" className="font-display text-xl font-semibold text-primary">
            Thank you for signing up!
          </p>
        ) : (
          <form
            onSubmit={newsletter.submit}
            className="flex w-full flex-col gap-3 sm:flex-row md:w-auto"
          >
            <Input
              type="email"
              required
              value={newsletter.email}
              onChange={(e) => newsletter.setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="h-12 rounded-full border-border bg-background px-5 text-base text-foreground sm:w-64 md:text-base"
            />
            <Button type="submit" variant="gold" size="lg" disabled={newsletter.status === "sending"}>
              {newsletter.status === "sending" ? "Subscribing…" : "Subscribe"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )
      }
    />
  );
}
