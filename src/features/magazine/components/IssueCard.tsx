import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { coverOnly, formatIssueDate, issueLine, type MagazineIssue } from "../model";
import { IssueCover } from "./IssueCover";

/** An issue on the shelf: its cover, title and a line about it. The whole card is the link. */
export function IssueCard({ issue }: { issue: MagazineIssue }) {
  return (
    <article className="group relative">
      <IssueCover issue={coverOnly(issue)} />
      <div className="mt-6">
        <p className="eyebrow text-gold">{issueLine(issue) || formatIssueDate(issue.publishDate)}</p>
        <h3 className="mt-2 text-2xl font-semibold text-balance text-primary">
          <Link href={`/magazine/${issue.slug}`} className="outline-none after:absolute after:inset-0 focus-visible:underline">
            {issue.title}
          </Link>
        </h3>
        {issue.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{issue.description}</p>}
        <p className="caps mt-4 inline-flex items-center gap-2 text-primary">
          Read the issue
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </p>
      </div>
    </article>
  );
}

export function IssueGrid({ issues }: { issues: MagazineIssue[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {issues.map((issue) => (
        <IssueCard key={issue.slug} issue={issue} />
      ))}
    </div>
  );
}
