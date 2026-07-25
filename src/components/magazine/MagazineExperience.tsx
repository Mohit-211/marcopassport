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
import CoverArt from "@/components/magazine/CoverArt";
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

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-primary-foreground/60">
        {label}
      </p>
      <p className="font-display text-xl font-semibold mt-1">{value}</p>
    </div>
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
        <div className="absolute inset-0 -z-10 opacity-30">
          <img
            src={magazine.cover}
            alt=""
            aria-hidden
            className="h-full w-full object-cover blur-3xl scale-125"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.22_0.06_240/0.8),oklch(0.22_0.06_240/0.97))]" />
        </div>
        <div className="container mx-auto px-5 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28">
          <Link
            href="/magazine"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary-foreground/80 hover:text-gold transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> All editions
          </Link>
          <div className="mt-8 grid md:grid-cols-[minmax(0,360px)_1fr] gap-12 lg:gap-20 items-center">
            <CoverArt magazine={magazine} />
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                {magazine.issue} · {magazine.season}
              </p>
              <h1 className="mt-3 font-display text-5xl md:text-7xl font-semibold leading-[1.02] text-balance">
                {magazine.title}
              </h1>
              <p className="mt-5 text-lg md:text-xl text-primary-foreground/85 max-w-2xl italic">
                {magazine.tagline}
              </p>
              <p className="mt-5 text-base text-primary-foreground/75 max-w-2xl leading-relaxed">
                {magazine.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => {
                    setPage(0);
                    setReader(true);
                  }}
                >
                  <BookOpen className="h-4 w-4" /> Start reading
                </Button>
                <Button
                  variant="outline"
                  size="lg"
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
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleShare}
                  className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md border-t border-primary-foreground/15 pt-6">
                <Meta label="Pages" value={String(magazine.pages)} />
                <Meta
                  label="Stories"
                  value={String(magazine.sections.length)}
                />
                <Meta label="Published" value={magazine.date} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reader + What's Inside */}
      <section className="bg-sand py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start">
            {/* Flipbook */}
            <div>
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                    The edition
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2 text-balance">
                    Flip through it
                  </h2>
                </div>
                <button
                  onClick={() => setReader(true)}
                  className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-primary hover:text-gold transition-colors"
                >
                  Fullscreen <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <Flipbook
                pages={pages}
                page={page}
                onPage={setPage}
                onPrev={prev}
                onNext={next}
                magazine={magazine}
              />
              <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>{currentPage?.label}</span>
                <span>
                  {page + 1} / {total}
                </span>
              </div>
            </div>
            {/* What's Inside */}
            <aside className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                  What's inside
                </p>
                <h3 className="font-display text-2xl font-semibold mt-2">
                  Highlights
                </h3>
                <ol className="mt-5 space-y-4">
                  {magazine.sections.map((s, i) => {
                    const targetPage = i + 1;
                    const active = page === targetPage;
                    return (
                      <li key={i}>
                        <button
                          onClick={() => setPage(targetPage)}
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
              <div className="rounded-3xl bg-primary text-primary-foreground p-6">
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
      <section className="container mx-auto px-5 lg:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              Continue reading
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 text-balance">
              Explore other editions
            </h2>
          </div>
          <Link href="/magazine" className="hidden md:inline-block">
            <Button variant="outline">All editions</Button>
          </Link>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-5 px-5 lg:mx-0 lg:px-0">
          {others.map((m) => (
            <Link
              key={m.slug}
              href={`/magazine/${m.slug}`}
              className="group block shrink-0 snap-start w-[240px] md:w-[280px]"
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
                <IconBtn label="Share" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </IconBtn>
                <IconBtn label="Close" onClick={() => setReader(false)}>
                  <X className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
            {/* Page */}
            <div className="flex-1 min-h-0 overflow-auto bg-[radial-gradient(ellipse_at_center,oklch(0.32_0.06_240)_0%,oklch(0.18_0.05_240)_100%)] grid place-items-center p-4 md:p-10">
              <div
                style={{ transform: `scale(${zoom})` }}
                className="transition-transform duration-300"
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
