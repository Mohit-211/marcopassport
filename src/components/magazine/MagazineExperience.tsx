"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Share2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Magazine, magazines } from "@/data/magazines";
import { cn } from "@/lib/utils";
import Flipbook, {
  ReaderPage,
  buildSpreads,
} from "@/components/magazine/Flipbook";

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid place-items-center h-9 w-9 rounded-full text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
    >
      {children}
    </button>
  );
}

export default function MagazineExperience({
  magazine,
  others,
}: {
  magazine: Magazine;
  others: (typeof magazines)[number][];
}) {
  const pages = buildSpreads(magazine);
  const [page, setPage] = useState(0);
  const [reader, setReader] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [saved, setSaved] = useState(false);
  const total = pages.length;

  const next = () => setPage((p) => Math.min(p + 1, total - 1));
  const prev = () => setPage((p) => Math.max(p - 1, 0));

  const openAt = (i: number) => {
    setPage(i);
    setReader(true);
  };

  const goToPage = (i: number) => {
    setPage(i);
  };

  useEffect(() => {
    if (!reader) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setReader(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reader, total]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${magazine.title} · ${magazine.issue}`,
          text: magazine.tagline,
          url,
        });
        return;
      } catch {
        /* dismissed */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  // TODO: wire up to real library/passport store once backend is available
  const handleSave = () => {
    setSaved((s) => !s);
    toast.success(
      saved ? "Removed from your library" : "Saved to your library"
    );
  };

  const currentPage = pages[page];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="container mx-auto px-5 lg:px-8 pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-16">
          {/* Back link */}
          <Link
            href="/magazine"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary-foreground/80 hover:text-gold transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> All editions
          </Link>

          {/* Cover + info */}
          <div className="mt-6 grid items-center gap-6 sm:mt-8 sm:grid-cols-[150px_1fr] sm:gap-10 md:grid-cols-[190px_1fr] md:gap-14 lg:grid-cols-[220px_1fr] lg:gap-16">
            {/* Cover — plain photo, no overlaid text */}
            <div className="mx-auto w-24 sm:mx-0 sm:w-full">
              <div className="aspect-[2/3] overflow-hidden rounded-md shadow-elegant ring-1 ring-primary-foreground/10">
                <img
                  src={magazine.cover}
                  alt={`${magazine.title} cover`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                {magazine.issue} · {magazine.season}
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.05] text-balance sm:text-5xl md:text-6xl">
                {magazine.title}
              </h1>
              <p className="mt-3 text-sm italic text-primary-foreground/85 sm:mt-4 sm:text-base md:text-lg">
                {magazine.tagline}
              </p>
              <p className="mt-4 hidden max-w-xl text-sm leading-relaxed text-primary-foreground/70 sm:block">
                {magazine.description}
              </p>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-6 sm:justify-start">
                <Button variant="gold" onClick={() => openAt(0)}>
                  <BookOpen className="h-4 w-4" /> Start reading
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                >
                  {saved ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  {saved ? "Saved" : "Save"}
                </Button>
                <IconBtn label="Share" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </IconBtn>
              </div>

              {/* Meta */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-primary-foreground/60 sm:mt-6 sm:justify-start">
                <span>{magazine.pages} pages</span>
                <span className="h-1 w-1 rounded-full bg-gold" />
                <span>{magazine.sections.length} stories</span>
                <span className="h-1 w-1 rounded-full bg-gold" />
                <span>Published {magazine.date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reader + What's Inside */}
      <section className="bg-sand py-14 sm:py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start">
            {/* Reader */}
            <div>
              <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                    The edition
                  </p>
                  <h2 className="font-display text-2xl font-semibold mt-2 text-balance sm:text-3xl md:text-4xl">
                    Flip through it
                  </h2>
                </div>
                <button
                  onClick={() => setReader(true)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-primary hover:text-gold transition-colors"
                >
                  Fullscreen <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* One portrait page at a time — same reader on every screen size */}
              <Flipbook
                pages={pages}
                page={page}
                onPage={setPage}
                onPrev={prev}
                onNext={next}
                magazine={magazine}
              />
              <div className="mx-auto mt-5 flex max-w-[380px] sm:max-w-[420px] md:max-w-[440px] items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>{currentPage?.label}</span>
                <span>
                  {page + 1} / {total}
                </span>
              </div>
            </div>

            {/* What's Inside */}
            <aside className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                  What's inside
                </p>
                <h3 className="font-display text-xl font-semibold mt-2 sm:text-2xl">
                  Highlights
                </h3>
                <ol className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
                  {magazine.sections.map((s, i) => {
                    const targetPage = i + 1;
                    const active = page === targetPage;
                    return (
                      <li key={i}>
                        <button
                          onClick={() => goToPage(targetPage)}
                          className={cn(
                            "group w-full text-left flex gap-3 rounded-2xl p-3 -mx-3 transition-colors",
                            active ? "bg-gold/15" : "hover:bg-sand"
                          )}
                        >
                          <span
                            className={cn(
                              "shrink-0 grid place-items-center h-7 w-7 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              active
                                ? "bg-gold text-gold-foreground"
                                : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                            )}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                              {s.kicker}
                            </span>
                            <span className="block font-display text-base leading-snug mt-1 text-foreground">
                              {s.title}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="rounded-3xl bg-primary text-primary-foreground p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                  Share this issue
                </p>
                <p className="text-sm text-primary-foreground/80 mt-2 leading-relaxed">
                  Send the link to someone who'd love it. We'll keep your spot
                  here.
                </p>
                <Button
                  variant="gold"
                  className="mt-4 w-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" /> Copy share link
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* More editions */}
      <section className="container mx-auto px-5 lg:px-8 py-14 sm:py-20 md:py-28">
        <div className="flex items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              Continue reading
            </p>
            <h2 className="font-display text-3xl font-semibold mt-2 text-balance sm:text-4xl md:text-5xl">
              Explore other editions
            </h2>
          </div>
          <Link href="/magazine" className="hidden md:inline-block">
            <Button variant="outline">All editions</Button>
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-5 px-5 sm:gap-8 lg:mx-0 lg:px-0">
          {others.map((m) => (
            <Link
              key={m.slug}
              href={`/magazine/${m.slug}`}
              className="group block shrink-0 snap-start w-[210px] md:w-[280px]"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-md shadow-elegant ring-1 ring-foreground/10 transition-transform duration-500 group-hover:-translate-y-2">
                <img
                  src={m.cover}
                  alt={`${m.title} ${m.issue}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/15 to-transparent" />
                <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between text-primary-foreground">
                  <span className="font-display text-xs tracking-[0.18em] uppercase">
                    Marco
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-gold">
                    {m.issue}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gold/90">
                    {m.season}
                  </p>
                  <p className="font-display text-xl font-semibold mt-1 leading-tight">
                    {m.title}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {m.description}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-primary">
                  Read issue{" "}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Fullscreen reader */}
      <Dialog open={reader} onOpenChange={setReader}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[92vh] bg-primary border-none p-0 overflow-hidden text-primary-foreground">
          <div className="flex flex-col h-full">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-primary-foreground/10 shrink-0">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold">
                  {magazine.issue} · {magazine.season}
                </p>
                <p className="font-display text-base md:text-lg font-semibold truncate">
                  {magazine.title}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <div className="hidden sm:flex items-center gap-1">
                  <IconBtn
                    label="Zoom out"
                    onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </IconBtn>
                  <span className="text-xs tabular-nums w-12 text-center text-primary-foreground/70">
                    {Math.round(zoom * 100)}%
                  </span>
                  <IconBtn
                    label="Zoom in"
                    onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </IconBtn>
                  <div className="w-px h-5 bg-primary-foreground/15 mx-2" />
                </div>
                <IconBtn label="Share" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </IconBtn>
                <IconBtn label="Close" onClick={() => setReader(false)}>
                  <X className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
            {/* Page — one portrait page, centered, same on every screen size */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-[radial-gradient(ellipse_at_center,oklch(0.32_0.06_240)_0%,oklch(0.18_0.05_240)_100%)] p-4 grid place-items-center md:p-10">
              <div
                style={{ transform: `scale(${zoom})` }}
                className="w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] transition-transform duration-300"
              >
                <ReaderPage page={currentPage!} magazine={magazine} />
              </div>
            </div>
            {/* Bottom nav */}
            <div className="flex items-center justify-between gap-4 px-5 py-3 border-t border-primary-foreground/10 shrink-0">
              <Button
                variant="ghost"
                onClick={prev}
                disabled={page === 0}
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/70 hidden sm:block">
                Page {page + 1} of {total}
              </div>
              <Button
                variant="gold"
                onClick={next}
                disabled={page === total - 1}
                className="disabled:opacity-50"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
