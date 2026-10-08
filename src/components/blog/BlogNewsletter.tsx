"use client";

import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/site/CtaSection";

export default function BlogNewsletter() {
  return (
    <CtaSection
      eyebrow="The Dispatch"
      title="Island stories, delivered monthly."
      description="Join 12,000+ travelers getting our best guides, openings and quiet recommendations — straight from Marco Island."
      aside={
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full flex-col gap-3 sm:flex-row md:w-auto"
        >
          <Input
            type="email"
            placeholder="you@example.com"
            aria-label="Email address"
            className="h-12 rounded-full border-border bg-background px-5 text-base sm:w-64 md:text-base"
          />
          <Button type="submit" variant="gold" size="lg">
            Subscribe <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      }
    />
  );
}
