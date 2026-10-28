"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { formatIssueDate, issueLine, type MagazineIssue } from "../model";
import { MagazineReader, type MagazineReaderHandle } from "./MagazineReader";

/**
 * An issue's page: a dark reading room with the flipbook, then the editor's
 * letter and the contents, which open the book at that article.
 */
export function IssueExperience({ issue }: { issue: MagazineIssue }) {
  const reader = useRef<MagazineReaderHandle>(null);
  const facts = [
    issueLine(issue),
    formatIssueDate(issue.publishDate),
    `${issue.pages.length} ${issue.pages.length === 1 ? "page" : "pages"}`,
  ].filter(Boolean);
  const about = issue.letter.length > 0 ? issue.letter : [issue.description].filter(Boolean);

  return (
    <>
      <header className="bg-primary pt-(--header-height) text-primary-foreground">
        <div className="site-container pt-8 pb-2 md:pt-10">
          <nav aria-label="Breadcrumb" className="eyebrow">
            <Link href="/magazine" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-gold">
              <ChevronLeft className="h-3.5 w-3.5" /> Magazine
            </Link>
          </nav>
          <h1 className="text-display mt-4 font-medium text-balance">{issue.title}</h1>
          {issue.tagline && <p className="mt-3 max-w-2xl font-display text-lg text-primary-foreground/80 italic sm:text-xl">{issue.tagline}</p>}
          <p className="eyebrow mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-primary-foreground/70">
            {facts.map((fact, i) => (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-gold" />}
                {fact}
              </span>
            ))}
          </p>
        </div>
      </header>

      <MagazineReader ref={reader} issue={issue} />

      {(about.length > 0 || issue.contents.length > 0) && (
        <section className="site-container grid gap-12 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          {about.length > 0 && (
            <div>
              <p className="eyebrow text-gold">{issue.letter.length > 0 ? "From the editor" : "About this issue"}</p>
              <div className="mt-4 space-y-4 leading-relaxed text-foreground/80">
                {about.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
          {issue.contents.length > 0 && (
            <div>
              <p className="eyebrow text-gold">In this issue</p>
              <ol className="mt-2 divide-y divide-border">
                {issue.contents.map((entry) => (
                  <li key={entry.pageNumber}>
                    <button
                      type="button"
                      onClick={() => reader.current?.goTo(entry.pageNumber - 1)}
                      className="group flex w-full items-baseline gap-4 py-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <span className="caps w-8 shrink-0 text-gold tabular-nums">{String(entry.pageNumber).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1">
                        {entry.kicker && <span className="caps block text-muted-foreground">{entry.kicker}</span>}
                        <span className="mt-1 block font-display text-xl font-semibold text-primary transition-colors group-hover:text-gold">
                          {entry.title}
                        </span>
                        {entry.description && <span className="mt-1 block text-sm text-muted-foreground">{entry.description}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}
    </>
  );
}
