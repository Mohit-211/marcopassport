import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Magazine } from "@/data/magazines";

function buildSpreads(magazine: Magazine) {
  const pages = [
    { kind: "cover" as const, image: magazine.cover, label: "Cover" },
    ...magazine.sections.map((s, i) => ({
      kind: "spread" as const,
      image: s.image,
      label: `${s.kicker} · ${s.title}`,
      kicker: s.kicker,
      title: s.title,
      index: i + 1,
    })),
    { kind: "back" as const, image: magazine.cover, label: "Back cover" },
  ];
  return pages;
}

type Page = ReturnType<typeof buildSpreads>[number];

export { buildSpreads };
export type { Page };

/**
 * Renders a single magazine page — always a portrait "page" shape
 * (height greater than width), never a two-page landscape spread.
 * Used both inside the interactive Flipbook (fill) and standalone in
 * the fullscreen reader dialog (sizes itself via its own aspect ratio).
 */
export function ReaderPage({
  page,
  magazine,
  fill = false,
}: {
  page: Page;
  magazine: Magazine;
  fill?: boolean;
}) {
  const dims = fill ? "absolute inset-0" : "relative w-full aspect-[3/4]";

  if (page.kind === "cover" || page.kind === "back") {
    return (
      <div className={cn(dims, "overflow-hidden")}>
        <img src={page.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-primary/30" />
        <div className="absolute top-0 inset-x-0 p-4 sm:p-5 flex items-center justify-between text-primary-foreground">
          <span className="font-display text-sm tracking-[0.18em] uppercase">
            Marco
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-gold">
            {magazine.issue}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-primary-foreground">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold/90">
            {magazine.season}
          </p>
          <p className="font-display font-semibold leading-[0.95] text-3xl sm:text-4xl mt-2 text-balance">
            {page.kind === "back" ? "Until next issue" : magazine.title}
          </p>
          <p className="italic text-primary-foreground/85 mt-3 text-sm">
            {page.kind === "back" ? "Thank you for reading." : magazine.tagline}
          </p>
        </div>
      </div>
    );
  }

  // content page — image on top, text below, scrolls if it runs long
  return (
    <div className={cn(dims, "overflow-hidden bg-background flex flex-col")}>
      <div className="relative h-[42%] shrink-0">
        <img
          src={page.image}
          alt={page.title ?? ""}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto bg-background text-foreground p-5 sm:p-6 flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold font-semibold">
          {page.kicker}
        </p>
        <h3 className="font-display text-xl sm:text-2xl font-semibold mt-2 text-balance leading-tight">
          {page.title}
        </h3>
        <p className="mt-3 text-foreground/80 leading-relaxed text-sm first-letter:font-display first-letter:text-2xl first-letter:font-semibold first-letter:text-primary first-letter:float-left first-letter:mr-2 first-letter:leading-[0.85]">
          {magazine.letter[0] ??
            "A short essay drawn from this issue — read the full feature inside the magazine."}
        </p>
        <p className="mt-3 text-foreground/70 leading-relaxed text-sm hidden sm:block">
          {magazine.letter[1] ??
            "Each story is photographed on location, written by contributors who live the island, and printed to be returned to."}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-muted-foreground border-t border-border">
          <span>{magazine.title}</span>
          <span>№ {String(page.index ?? 0).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}

export default function Flipbook({
  pages,
  page,
  onPage,
  onPrev,
  onNext,
  magazine,
}: {
  pages: Page[];
  page: number;
  onPage: (n: number) => void;
  onPrev: () => void;
  onNext: () => void;
  magazine: Magazine;
}) {
  const total = pages.length;
  const current = pages[page]!;

  return (
    <div className="mx-auto w-full max-w-[380px] sm:max-w-[420px] md:max-w-[440px]">
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-primary shadow-elegant">
        {/* Page */}
        <div key={page} className="absolute inset-0 animate-fade-in">
          <ReaderPage page={current} magazine={magazine} fill />
        </div>
        {/* Nav buttons */}
        <button
          onClick={onPrev}
          disabled={page === 0}
          aria-label="Previous page"
          className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-background/90 text-foreground shadow-elegant hover:bg-background disabled:opacity-0 disabled:pointer-events-none transition-opacity"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={onNext}
          disabled={page === total - 1}
          aria-label="Next page"
          className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-gold text-gold-foreground shadow-elegant hover:brightness-105 disabled:opacity-0 disabled:pointer-events-none transition-opacity"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      {/* Page dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => onPage(i)}
            aria-label={`Go to page ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === page
                ? "w-8 bg-gold"
                : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
