import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { IssueCover } from "@/features/magazine/components/IssueCover";
import { coverOnly, issueLine } from "@/features/magazine/model";
import { getMagazineShelf } from "@/features/magazine/shelf";

/** The home page shows the current (featured) issue; the rest live on /magazine. */
export async function MagazineStrip() {
  const { featured: issue } = await getMagazineShelf();
  const href = `/magazine/${issue.slug}`;
  const facts = [
    `${issue.pages.length} pages`,
    issue.contents.length > 0 && `${issue.contents.length} ${issue.contents.length === 1 ? "article" : "articles"}`,
  ].filter(Boolean);

  return (
    <section className="overflow-hidden bg-primary py-16 text-primary-foreground md:py-24">
      <div className="site-container grid items-center gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-16 lg:grid-cols-[minmax(0,360px)_1fr]">
        <Link href={href} className="group mx-auto block w-56 sm:w-64 md:mx-0 md:w-full" aria-label={`Read ${issue.title}`}>
          <IssueCover issue={coverOnly(issue)} />
        </Link>

        <div className="max-w-2xl">
          <p className="eyebrow text-gold">
            The current issue
            {/* On phones the issue line takes a line of its own, rather than one starting with "·" */}
            {issueLine(issue) && (
              <span className="mt-1 block sm:mt-0 sm:inline">
                <span className="hidden sm:inline"> · </span>
                {issueLine(issue)}
              </span>
            )}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">{issue.title}</h2>
          {issue.tagline && (
            <p className="mt-3 font-display text-lg text-primary-foreground/85 italic sm:text-xl">{issue.tagline}</p>
          )}
          {issue.description && (
            <p className="mt-5 max-w-xl text-sm leading-7 text-primary-foreground/70 sm:text-base">{issue.description}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button variant="gold" size="lg" nativeButton={false} render={<Link href={href} />}>
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

          <p className="eyebrow mt-8 flex flex-wrap items-center gap-3 text-primary-foreground/60">
            {facts.map((fact, i) => (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-gold" />}
                {fact}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
