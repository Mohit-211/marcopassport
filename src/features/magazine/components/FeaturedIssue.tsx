import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coverOnly, formatIssueDate, issueLine, type MagazineIssue } from "../model";
import { IssueCover } from "./IssueCover";

/** The featured issue, large: its cover beside the opening of the editor's letter. */
export function FeaturedIssue({ issue }: { issue: MagazineIssue }) {
  const href = `/magazine/${issue.slug}`;
  const intro = issue.letter.length > 0 ? issue.letter.slice(0, 2) : [issue.description].filter(Boolean);
  const facts = [
    `${issue.pages.length} pages`,
    issue.contents.length > 0 && `${issue.contents.length} ${issue.contents.length === 1 ? "article" : "articles"}`,
    formatIssueDate(issue.publishDate),
  ].filter(Boolean);

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="site-container grid items-center gap-10 md:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
        <Link href={href} className="group mx-auto block w-full max-w-sm md:mx-0 md:max-w-none" aria-label={`Read ${issue.title}`}>
          <IssueCover issue={coverOnly(issue)} />
        </Link>
        <div>
          <p className="eyebrow flex flex-wrap items-center gap-x-1.5 gap-y-1 text-gold">
            <Sparkles className="h-3.5 w-3.5" /> The current issue
            {/* On phones the issue line takes a line of its own, rather than one starting with "·" */}
            {issueLine(issue) && (
              <span className="basis-full sm:basis-auto">
                <span className="hidden sm:inline">· </span>
                {issueLine(issue)}
              </span>
            )}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-balance text-primary md:text-4xl">{issue.title}</h2>
          {issue.tagline && <p className="mt-3 font-display text-xl text-foreground/80 italic">{issue.tagline}</p>}
          {intro.length > 0 && (
            <div className="mt-6 space-y-4 leading-relaxed text-foreground/80">
              {intro.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}
          <div className="mt-8">
            <Button variant="gold" size="lg" nativeButton={false} render={<Link href={href} />}>
              Read now <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="eyebrow mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
            {facts.map((fact, i) => (
              <span key={i} className="flex items-center gap-4">
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
