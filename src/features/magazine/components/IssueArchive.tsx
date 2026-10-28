import Link from "next/link";
import { coverOnly, formatIssueDate, issueLine, type MagazineIssue } from "../model";
import { IssueCover } from "./IssueCover";

/** Older issues, smaller, by date. Hidden while there are none. */
export function IssueArchive({ issues }: { issues: MagazineIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-24">
      <div className="site-container">
        <div className="mb-12 flex items-end justify-between gap-4 border-b border-primary-foreground/15 pb-6">
          <div>
            <p className="eyebrow text-gold">The archive</p>
            <h2 className="mt-2 text-3xl font-semibold text-balance md:text-4xl">Past issues</h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-primary-foreground/60 md:block">
            Out of season, still worth reading.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8 lg:grid-cols-6">
          {issues.map((issue) => (
            <article key={issue.slug} className="group relative">
              <IssueCover issue={coverOnly(issue)} />
              <p className="caps mt-3 text-gold">{issueLine(issue) || formatIssueDate(issue.publishDate)}</p>
              <h3 className="mt-1 text-base leading-tight">
                <Link href={`/magazine/${issue.slug}`} className="outline-none after:absolute after:inset-0 focus-visible:underline">
                  {issue.title}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
