"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlogNewsletter() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-5 lg:px-8 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            The Dispatch
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-3 text-balance">
            Island stories, delivered monthly.
          </h2>
          <p className="text-primary-foreground/70 mt-4 max-w-md">
            Join 12,000+ travelers getting our best guides, openings and quiet
            recommendations — straight from Marco Island.
          </p>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 bg-background/10 backdrop-blur p-2 rounded-full border border-primary-foreground/15"
        >
          <Input
            type="email"
            placeholder="you@example.com"
            className="flex-1 h-12 rounded-full bg-transparent border-0 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0"
          />
          <Button className="h-12 rounded-full bg-gold text-gold-foreground hover:bg-gold/90 px-7 font-semibold">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
