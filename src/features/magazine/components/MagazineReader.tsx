"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import type { PageFlip } from "page-flip";
import { ChevronLeft, ChevronRight, Expand, LayoutGrid, Loader2, Minimize, Share2, X, ZoomIn } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { shareLink } from "@/lib/share";
import { cn } from "@/lib/utils";
import { imageSources } from "../renderer/content";
import { MagazinePageView } from "../renderer/MagazinePageView";
import { pageRatio } from "../renderer/pdf";
import { spreadIndexOf, toSpreads } from "../renderer/spreads";
import type { RenderContext } from "../renderer/types";
import { issueMeta, magazineImage, type MagazineIssue } from "../model";
import "./reader.css";

export interface MagazineReaderHandle {
  /** Brings the reader into view and turns to a page (0-based). */
  goTo: (pageIndex: number) => void;
}

const FLIP_MS = 800;
/** Narrower than two pages this wide, the book shows one page at a time. */
const MIN_PAGE_WIDTH = 300;
const MAX_PAGE_WIDTH = 900;
/** Pages either side of the open spread whose photos load ahead of a turn. */
const PRELOAD_BEHIND = 2;
const PRELOAD_AHEAD = 5;
/** How long the open pages' photos may take before the reader says they're loading. */
const SLOW_PHOTOS_MS = 400;

type Book = { flip: PageFlip; sheets: HTMLElement[] };

const noSubscription = () => () => {};

/**
 * page-flip turns the page on a press anywhere except right on a link or
 * button, so a press on the words or photo inside one (a contents line, a
 * guide's Explore link) would turn the page instead. Those presses stop at the
 * sheet, before they reach page-flip.
 */
const keepPressOnLink = (event: Event) => {
  if (event.target instanceof Element && event.target.closest("a, button")) event.stopPropagation();
};

/** Starts loading a photo; settles once it's in (or has failed). */
const loadImage = (src: string, priority: "high" | "low") =>
  new Promise<void>((resolve) => {
    const image = new Image();
    image.fetchPriority = priority;
    image.onload = image.onerror = () => resolve();
    image.src = src;
  });

/**
 * An issue as a flipbook, like a printed magazine: the cover on its own, then
 * facing pages that curl over as you drag a corner, click or swipe, and one
 * page at a time on narrow screens. The pages are drawn by the admin builder's
 * own renderer, so they look exactly as they did there.
 */
export function MagazineReader({
  issue,
  ref,
  className,
}: {
  issue: MagazineIssue;
  ref?: Ref<MagazineReaderHandle>;
  className?: string;
}) {
  const { pages, contents } = issue;
  const count = pages.length;
  const ratio = useMemo(() => pageRatio(pages), [pages]);
  const spreads = useMemo(() => toSpreads(count), [count]);
  const meta = useMemo(() => issueMeta(issue), [issue]);
  const stage = useRef<HTMLElement>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [current, setCurrent] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const [panel, setPanel] = useState<"pages" | "zoom" | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [photosLoading, setPhotosLoading] = useState(false);
  const canFullscreen = useSyncExternalStore(noSubscription, () => document.fullscreenEnabled, () => false);

  // page-flip moves the sheets into its own wrapper, so they're made here
  // rather than by React, and each page is rendered into its sheet with a
  // portal (below). The library only loads in the browser.
  const host = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || count === 0) return;
      let cancelled = false;
      let flip: PageFlip | null = null;
      const root = document.createElement("div");
      node.appendChild(root);
      const sheets = pages.map((page, index) => {
        const sheet = document.createElement("div");
        sheet.className = "magazine-sheet";
        sheet.addEventListener("mousedown", keepPressOnLink);
        sheet.addEventListener("touchstart", keepPressOnLink, { passive: true });
        // The covers turn stiffly, like card.
        if (index === 0 || (index === count - 1 && page.layout === "back")) sheet.dataset.density = "hard";
        return sheet;
      });
      // page-flip measures the book on window resizes only, but it also
      // changes size without one: full screen, a scrollbar coming or going.
      const resized = new ResizeObserver(() => flip?.getRender().update());
      resized.observe(node);
      const asked = Number(new URLSearchParams(window.location.search).get("page"));
      const startPage = Number.isInteger(asked) && asked >= 1 && asked <= count ? asked - 1 : 0;

      import("page-flip").then(({ PageFlip }) => {
        if (cancelled) return;
        const width = 600;
        flip = new PageFlip(root, {
          width,
          height: Math.round(width / ratio),
          size: "stretch",
          minWidth: MIN_PAGE_WIDTH,
          maxWidth: MAX_PAGE_WIDTH,
          minHeight: Math.round(MIN_PAGE_WIDTH / ratio),
          maxHeight: Math.round(MAX_PAGE_WIDTH / ratio),
          showCover: true,
          usePortrait: true,
          mobileScrollSupport: true,
          drawShadow: true,
          maxShadowOpacity: 0.45,
          flippingTime: FLIP_MS,
          showPageCorners: true,
          startPage,
        });
        flip.loadFromHTML(sheets);
        flip.on("flip", (e) => setCurrent(e.data));
        flip.on("changeOrientation", (e) => setPortrait(e.data === "portrait"));
        setCurrent(flip.getCurrentPageIndex());
        setPortrait(flip.getOrientation() === "portrait");
        setBook({ flip, sheets });
      });

      return () => {
        cancelled = true;
        resized.disconnect();
        flip?.destroy();
        root.remove();
        setBook(null);
      };
    },
    [pages, count, ratio],
  );

  const goToPage = useCallback(
    (index: number) => {
      if (book && index >= 0 && index < count) book.flip.flip(index);
    },
    [book, count],
  );
  const pageIndexOf = useCallback((id: string) => pages.findIndex((page) => page.id === id), [pages]);

  const contextFor = (index: number, interactive = true): RenderContext => ({
    issue: meta,
    pageNumber: index + 1,
    mode: "read",
    resolveImage: magazineImage,
    contents,
    ...(interactive && { goToPage, pageIndexOf }),
  });

  useImperativeHandle(
    ref,
    () => ({
      goTo: (index) => {
        stage.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        // Turn once the reader is in view, so the turn is seen.
        window.setTimeout(() => goToPage(index), 450);
      },
    }),
    [goToPage],
  );

  // The page in the address bar, so a link opens the issue where you are.
  useEffect(() => {
    if (!book) return;
    const url = new URL(window.location.href);
    if (current > 0) url.searchParams.set("page", String(current + 1));
    else url.searchParams.delete("page");
    window.history.replaceState(null, "", url);
  }, [book, current]);

  // The open pages' photos load first, then those of the pages either side, so
  // a page has its pictures by the time it's turned to. (Pages imported from a
  // PDF are large photos; loading them all at once would hold up the open one.)
  useEffect(() => {
    if (count === 0) return;
    const open = spreads[spreadIndexOf(current)] ?? [current];
    const near: number[] = [];
    for (let at = Math.max(0, current - PRELOAD_BEHIND); at <= Math.min(count - 1, current + PRELOAD_AHEAD); at++) {
      if (!open.includes(at)) near.push(at);
    }
    const photosOf = (indexes: number[]) => indexes.flatMap((at) => imageSources(pages[at].content)).map(magazineImage);
    let cancelled = false;
    const slow = window.setTimeout(() => setPhotosLoading(true), SLOW_PHOTOS_MS);
    Promise.all(photosOf(open).map((src) => loadImage(src, "high"))).then(() => {
      window.clearTimeout(slow);
      if (cancelled) return;
      setPhotosLoading(false);
      photosOf(near).forEach((src) => loadImage(src, "low"));
    });
    return () => {
      cancelled = true;
      window.clearTimeout(slow);
    };
  }, [current, pages, count, spreads]);

  useEffect(() => {
    if (!book) return;
    const onKey = (e: KeyboardEvent) => {
      if (panel || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      if (e.key === "ArrowRight") book.flip.flipNext();
      else if (e.key === "ArrowLeft") book.flip.flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [book, panel]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === stage.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  if (count === 0) {
    return (
      <section className={cn("magazine-reader grid place-items-center px-6 py-24 text-center text-primary-foreground/80", className)}>
        <p>This issue has no pages yet.</p>
      </section>
    );
  }

  const spread = spreads[spreadIndexOf(current)] ?? [current];
  const visible = portrait ? [current] : spread;
  const label =
    visible.length === 2 ? `Pages ${visible[0] + 1}–${visible[1] + 1} of ${count}` : `Page ${visible[0] + 1} of ${count}`;
  const atStart = visible[0] === 0;
  const atEnd = visible[visible.length - 1] >= count - 1;
  // A page on its own (the cover, a last back page) sits on one half of the
  // open book; move the book so it's centred.
  const alone = !portrait && visible.length === 1;
  const shift = alone ? (visible[0] === 0 ? "-25%" : "25%") : "0%";

  const share = () =>
    shareLink({
      title: issue.title,
      text: issue.tagline || undefined,
      url: `${window.location.origin}/magazine/${issue.slug}${current > 0 ? `?page=${current + 1}` : ""}`,
    });

  const toggleFullscreen = () => {
    const request = document.fullscreenElement ? document.exitFullscreen() : stage.current?.requestFullscreen();
    request?.catch(() => {});
  };

  return (
    <section
      ref={stage}
      aria-label={`${issue.title}, page by page`}
      className={cn(
        "magazine-reader relative scroll-mt-(--header-height) overflow-hidden py-6 text-primary-foreground sm:py-8",
        className,
      )}
      style={{ "--mag-ratio": ratio } as CSSProperties}
    >
      <div className="relative px-4 sm:px-14">
        <div ref={host} className="magazine-book" style={{ transform: `translateX(${shift})` }} />
        {!book && (
          // The cover, still, while the flipbook loads.
          <div className="magazine-poster" inert>
            <MagazinePageView page={pages[0]} ctx={contextFor(0, false)} />
          </div>
        )}

        {/* Large side arrows on wide screens */}
        <SideArrow side="left" label="Previous page" disabled={!book || atStart} onClick={() => book?.flip.flipPrev()} />
        <SideArrow side="right" label="Next page" disabled={!book || atEnd} onClick={() => book?.flip.flipNext()} />

        {photosLoading && (
          <p
            role="status"
            className="pointer-events-none absolute top-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-primary shadow-soft backdrop-blur"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Loading pages…
          </p>
        )}
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 sm:justify-between">
        <div className="flex items-center gap-1">
          <ToolButton label="Previous page" disabled={!book || atStart} onClick={() => book?.flip.flipPrev()}>
            <ChevronLeft className="h-5 w-5" />
          </ToolButton>
          <p aria-live="polite" className="min-w-36 text-center text-sm tabular-nums text-primary-foreground/85">
            {label}
          </p>
          <ToolButton label="Next page" disabled={!book || atEnd} onClick={() => book?.flip.flipNext()}>
            <ChevronRight className="h-5 w-5" />
          </ToolButton>
        </div>
        <div className="flex items-center gap-1">
          <ToolButton label="All pages" onClick={() => setPanel("pages")}>
            <LayoutGrid className="h-4.5 w-4.5" />
          </ToolButton>
          <ToolButton label="Zoom in" onClick={() => setPanel("zoom")}>
            <ZoomIn className="h-4.5 w-4.5" />
          </ToolButton>
          {canFullscreen && (
            <ToolButton label={fullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFullscreen}>
              {fullscreen ? <Minimize className="h-4.5 w-4.5" /> : <Expand className="h-4.5 w-4.5" />}
            </ToolButton>
          )}
          <ToolButton label="Share this page" onClick={share}>
            <Share2 className="h-4.5 w-4.5" />
          </ToolButton>
        </div>
      </div>

      {book?.sheets.map((sheet, index) =>
        createPortal(<MagazinePageView page={pages[index]} ctx={contextFor(index)} />, sheet, pages[index].id),
      )}

      {/* The dialogs render outside the reader, so they're given the page shape too */}
      <Dialog open={panel === "pages"} onOpenChange={(open) => !open && setPanel(null)}>
        <DialogContent
          className="max-h-[85dvh] w-[min(92vw,64rem)] overflow-y-auto sm:max-w-none"
          style={{ "--mag-ratio": ratio } as CSSProperties}
        >
          <DialogTitle>All pages</DialogTitle>
          <ol className="mt-2 grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-6">
            {pages.map((page, index) => (
              <li key={page.id} className="relative">
                <div
                  inert
                  className={cn(
                    "overflow-hidden rounded-mark ring-1 ring-border",
                    visible.includes(index) && "ring-2 ring-gold",
                  )}
                >
                  <MagazinePageView page={page} ctx={contextFor(index, false)} />
                </div>
                <p className="caps mt-1.5 text-center text-muted-foreground">{index + 1}</p>
                <button
                  type="button"
                  aria-label={`Go to page ${index + 1}`}
                  aria-current={visible.includes(index) ? "page" : undefined}
                  onClick={() => {
                    book?.flip.turnToPage(index);
                    setPanel(null);
                  }}
                  className="absolute inset-0 rounded-mark outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
                />
              </li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>

      <Dialog open={panel === "zoom"} onOpenChange={(open) => !open && setPanel(null)}>
        <DialogContent
          showCloseButton={false}
          className="top-0 left-0 h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-primary p-0 sm:max-w-none"
          style={{ "--mag-ratio": ratio } as CSSProperties}
        >
          <DialogTitle className="sr-only">{label}, zoomed in</DialogTitle>
          <div className="h-full overflow-auto p-4 sm:p-8">
            {/* The open pages one under the other; on phones about twice the
                screen's width, to pan around. */}
            <div className="mx-auto flex w-max flex-col gap-4 sm:gap-8">
              {visible.map((index) => (
                <div key={pages[index].id} className="w-[180vw] shadow-elegant sm:w-[min(56rem,92vw)]">
                  <MagazinePageView page={pages[index]} ctx={contextFor(index)} />
                </div>
              ))}
            </div>
          </div>
          <DialogClose
            aria-label="Close zoom"
            className="absolute top-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-primary/70 text-primary-foreground ring-1 ring-primary-foreground/25 backdrop-blur transition-colors hover:bg-primary focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ToolButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip content={label}>
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className="grid h-10 w-10 place-items-center rounded-full text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-35"
      >
        {children}
      </button>
    </Tooltip>
  );
}

function SideArrow({
  side,
  label,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  // The toolbar has the same buttons, so these are for the pointer only.
  return (
    <button
      type="button"
      aria-label={label}
      aria-hidden
      tabIndex={-1}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-primary-foreground/10 text-primary-foreground ring-1 ring-primary-foreground/15 backdrop-blur transition hover:bg-primary-foreground/20 disabled:pointer-events-none disabled:opacity-0 sm:grid",
        side === "left" ? "left-1" : "right-1",
      )}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
