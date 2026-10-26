"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Google's embed fires "load" before it has drawn anything: on the live site
 * the pin and the tiles around it appeared 0.6–1.2 s later, the rest by ~3 s.
 * The next map is shown after this pause, then faded in.
 */
const SETTLE_MS = 1000;
const FADE_MS = 300;

type Frame = { src: string; shown: boolean; ready: boolean };

/**
 * A Google Maps Embed iframe (see features/passport/maps.ts) that never goes
 * blank between places. Giving an iframe a new src empties it until Google's
 * map has loaded and drawn, a second or two, so the next map loads in a
 * second iframe on top, invisible, and fades in once it has had time to draw.
 * The map in view stays until then, with a "Loading map" note over it. Size
 * the map with className.
 */
export function EmbedMap({ src, title, className }: { src: string; title: string; className?: string }) {
  const [frames, setFrames] = useState<Frame[]>([{ src, shown: true, ready: false }]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  // A new place: load it over the newest map in view. A newer place replaces
  // one still loading, so quick clicks don't queue up maps.
  if (frames[frames.length - 1].src !== src) {
    const inView = frames.filter((frame) => frame.shown).at(-1) ?? frames[0];
    setFrames(inView.src === src ? [inView] : [inView, { src, shown: false, ready: false }]);
  }

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const later = (run: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  };

  const loaded = (frameSrc: string) =>
    later(() => {
      setFrames((all) =>
        all.map((frame) => (frame.src === frameSrc ? { ...frame, shown: true, ready: true } : frame)),
      );
      // Once it has faded in, the maps under it can go.
      later(
        () =>
          setFrames((all) => {
            const index = all.findIndex((frame) => frame.src === frameSrc && frame.shown);
            return index > 0 ? all.slice(index) : all;
          }),
        FADE_MS,
      );
    }, SETTLE_MS);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {frames.map((frame, index) => (
        <iframe
          key={frame.src}
          src={frame.src}
          title={title}
          loading={index === 0 ? "lazy" : "eager"}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          aria-hidden={frame.shown ? undefined : true}
          tabIndex={frame.shown ? undefined : -1}
          onLoad={frame.ready ? undefined : () => loaded(frame.src)}
          className={cn(
            "absolute inset-0 h-full w-full border-0 transition-opacity duration-300 motion-reduce:transition-none",
            frame.shown ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
      ))}
      {!frames[frames.length - 1].ready && (
        <p
          role="status"
          className="pointer-events-none absolute top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-primary shadow-soft backdrop-blur"
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Loading map…
        </p>
      )}
    </div>
  );
}
