"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { MagazinePageView } from "../renderer/MagazinePageView";
import { pageRatio } from "../renderer/pdf";
import { issueMeta, magazineImage, type MagazineIssue } from "../model";

/**
 * An issue's cover, like a printed copy: its first page, drawn by the same
 * renderer as the reader, with a spine and a shadow. It's a picture only;
 * put it inside a link for the card around it.
 */
export function IssueCover({ issue, className }: { issue: MagazineIssue; className?: string }) {
  const page = issue.pages[0];
  return (
    <div
      className={cn("relative transition-transform duration-500 group-hover:-translate-y-1.5", className)}
      style={{ "--mag-ratio": pageRatio(issue.pages) } as CSSProperties}
    >
      <div inert className="relative overflow-hidden rounded-r-mark shadow-elegant ring-1 ring-foreground/10">
        {page ? (
          <MagazinePageView
            page={page}
            ctx={{ issue: issueMeta(issue), pageNumber: 1, mode: "read", resolveImage: magazineImage, contents: [] }}
          />
        ) : (
          <div className="mag-page grid place-items-center bg-primary p-6 text-center text-primary-foreground">
            <span className="text-2xl">{issue.masthead}</span>
          </div>
        )}
        {/* The spine: a shade along the bound edge */}
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[6%] bg-linear-to-r from-primary/35 to-transparent" />
      </div>
    </div>
  );
}
