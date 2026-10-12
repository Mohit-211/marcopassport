import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CoverMockup } from "@/components/magazine/CoverMockup";
import { magazines } from "@/data/magazines";

/** The home page shows just the current (featured) issue; the archive lives on /magazine. */
export function MagazineStrip() {
  const issue = magazines.find((m) => m.featured) ?? magazines[0];
  if (!issue) return null;

  return (
    <section className="overflow-hidden bg-primary py-16 text-primary-foreground md:py-24">
      <div className="site-container grid items-center gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-16 lg:grid-cols-[minmax(0,360px)_1fr]">
        <Link
          href={`/magazine/${issue.slug}`}
          className="group mx-auto block w-[220px] sm:w-[260px] md:mx-0 md:w-full"
          aria-label={`Read ${issue.title}, ${issue.issue}`}
        >
          <CoverMockup magazine={issue} large />
        </Link>

        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            The current issue · {issue.issue} · {issue.season}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-balance sm:text-4xl md:text-5xl">
            {issue.title}
          </h2>
          <p className="mt-3 font-display text-lg italic text-primary-foreground/85 sm:text-xl">{issue.tagline}</p>
          <p className="mt-5 max-w-xl text-sm leading-7 text-primary-foreground/70 sm:text-base">{issue.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button variant="gold" size="lg" nativeButton={false} render={<Link href={`/magazine/${issue.slug}`} />}>
              Read the issue <ArrowRight className="h-4 w-4" />
            </Button>
            <Link
              href="/magazine"
              className="group inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-primary-foreground"
            >
              Browse past issues
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
            <span>{issue.pages} pages</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>{issue.sections.length} stories inside</span>
          </p>
        </div>
      </div>
    </section>
  );
}
