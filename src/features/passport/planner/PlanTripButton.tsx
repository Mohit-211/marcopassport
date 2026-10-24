"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePassports } from "../PassportsProvider";
import { TripPlannerDialog } from "./TripPlannerDialog";

/** Pages with a fixed bottom action bar below lg: a place's page on Explore (see ExploreDetail). */
const HAS_MOBILE_ACTION_BAR = /^\/explore\/[^/]+/;

/**
 * Starfish outline in a 100×100 viewBox: five arms, alternating outer tips and
 * inner valleys, smoothed with quadratic curves through the edge midpoints so
 * tips and valleys come out rounded. `scale` shrinks it for the inner gold ring.
 */
function starfishPath(scale = 1) {
  const arms = 5;
  const [cx, cy] = [50, 53]; // nudged down so the top arm and bottom pair balance
  const outer = 49 * scale;
  const inner = 25 * scale; // deep valleys so the arms read as separate limbs
  const tipR = 8 * scale; // round, blunt arm tips
  const step = (2 * Math.PI) / arms;
  const at = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const f = (p: number[]) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;

  // Each arm: a semicircular tip, then a smooth concave curve down into the
  // valley and up the next arm's side (both controls sit at the valley).
  const shoulders = Array.from({ length: arms }, (_, i) => {
    const a = i * step - Math.PI / 2;
    const [tx, ty] = at(outer - tipR, a);
    const [px, py] = [-Math.sin(a) * tipR, Math.cos(a) * tipR];
    return { left: [tx - px, ty - py], right: [tx + px, ty + py], valley: at(inner, a + step / 2) };
  });

  let d = `M ${f(shoulders[0].left)}`;
  shoulders.forEach((s, i) => {
    const next = shoulders[(i + 1) % arms];
    d += ` A ${tipR.toFixed(2)} ${tipR.toFixed(2)} 0 0 1 ${f(s.right)}`;
    d += ` C ${f(s.valley)} ${f(s.valley)} ${f(next.left)}`;
  });
  return `${d} Z`;
}

const STARFISH_PATH = starfishPath();
const STARFISH_RING_PATH = starfishPath(0.86);

/** Bumps along each arm's spine, outside the label area. */
const STARFISH_BUMPS = Array.from({ length: 5 }, (_, i) => {
  const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
  return [31, 37, 42].map((r, j) => ({ x: 50 + r * Math.cos(a), y: 53 + r * Math.sin(a), r: 1.6 - j * 0.35 }));
}).flat();

/** Small 4-point star accent beside "PASSPORT". */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden className={className}>
      <path d="M5 0 C5.6 3.4 6.6 4.4 10 5 C6.6 5.6 5.6 6.6 5 10 C4.4 6.6 3.4 5.6 0 5 C3.4 4.4 4.4 3.4 5 0 Z" fill="currentColor" />
    </svg>
  );
}

/** Places in the plan the modal opens on: the guest draft, or the most recently edited passport. */
function usePlanCount() {
  const { ready, isAuthenticated, passports, draft } = usePassports();
  if (!ready) return 0;
  if (!isAuthenticated) return draft?.items.length ?? 0;
  const latest = passports[0];
  return latest ? (latest.items?.length ?? latest.item_count ?? 0) : 0;
}

/**
 * Floating starfish "Your Passport" button, bottom-right on every page;
 * opens the full-screen planner. Colours are theme tokens (navy in light
 * mode, beige in dark), stacking uses --z-floating (above page bars, below
 * dialogs), and the hover lift/tilt is skipped for reduced motion.
 */
export function PlanTripButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const uid = useId().replace(/:/g, "");
  const pathname = usePathname();
  const aboveActionBar = HAS_MOBILE_ACTION_BAR.test(pathname ?? "");
  const count = usePlanCount();
  const countLabel = `${count} ${count === 1 ? "place" : "places"} in your passport`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        // The count is part of the name, so screen readers hear it with the button.
        aria-label={count > 0 ? `Open your Passport, ${countLabel}` : "Open your Passport"}
        className={cn(
          "group fixed right-5 z-(--z-floating) size-37 rounded-full outline-none max-[759px]:size-32",
          "bottom-[calc(20px+env(safe-area-inset-bottom))]",
          // Sit above the place pages' mobile action bar instead of covering it.
          aboveActionBar && "max-lg:bottom-[calc(96px+env(safe-area-inset-bottom))]",
          "transition-transform duration-200 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:rotate-3 motion-reduce:transition-none",
          "focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
      >
        {/* Starfish: primary fill, thin light outline so it reads on photos and on white */}
        <svg
          viewBox="0 0 100 100"
          aria-hidden
          className="absolute inset-0 h-full w-full drop-shadow-elegant transition-[filter] duration-300 group-hover:drop-shadow-gold"
        >
          <defs>
            {/* Lit from the top-left: lighter centre fading to a deeper edge */}
            <radialGradient id={`${uid}-fill`} cx="38%" cy="32%" r="75%">
              <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--primary) 78%, var(--primary-foreground))" }} />
              <stop offset="55%" style={{ stopColor: "var(--primary)" }} />
              <stop offset="100%" style={{ stopColor: "color-mix(in oklab, var(--primary) 80%, var(--foreground))" }} />
            </radialGradient>
            {/* Metallic gold for the ring */}
            <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--gold) 60%, var(--primary-foreground))" }} />
              <stop offset="50%" style={{ stopColor: "var(--gold)" }} />
              <stop offset="100%" style={{ stopColor: "color-mix(in oklab, var(--gold) 70%, var(--gold-foreground))" }} />
            </linearGradient>
            {/* Soft gloss across the upper arms */}
            <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--primary-foreground)", stopOpacity: 0.22 }} />
              <stop offset="45%" style={{ stopColor: "var(--primary-foreground)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={STARFISH_PATH} fill={`url(#${uid}-fill)`} className="stroke-primary-foreground" strokeWidth={2} strokeLinejoin="round" />
          <path d={STARFISH_PATH} fill={`url(#${uid}-gloss)`} />
          {STARFISH_BUMPS.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={`url(#${uid}-gold)`} opacity={0.85} />
          ))}
          {/* Gold ring following the shape */}
          <path d={STARFISH_RING_PATH} fill="none" stroke={`url(#${uid}-gold)`} strokeWidth={1.1} strokeLinejoin="round" />
        </svg>

        {/* Nothing under 11px; on phones the starfish is too small for the pill, so it's left out. */}
        <span aria-hidden className="relative flex h-full flex-col items-center justify-center pt-[6%] text-primary-foreground">
          <span className="caps text-gold dark:text-primary-foreground">Your</span>
          <span className="mt-0.5 flex items-center gap-1">
            <Sparkle className="size-2 text-gold max-[759px]:hidden dark:text-primary-foreground" />
            <span className="font-display text-sm leading-none font-bold uppercase max-[759px]:text-caption max-[759px]:tracking-tight">Passport</span>
            <Sparkle className="size-2 text-gold max-[759px]:hidden dark:text-primary-foreground" />
          </span>
          <span className="relative mt-3 overflow-hidden rounded-full bg-gold px-2 py-0.5 text-caption font-bold tracking-wide text-gold-foreground uppercase shadow-soft max-[759px]:hidden">
            Tap to plan
            {/* Periodic shine sweeping across the pill */}
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-primary-foreground/60 to-transparent motion-safe:animate-[passport-shine_3.5s_ease-in-out_infinite] motion-reduce:hidden" />
          </span>
        </span>

        {/* Count of places in My Plan; hidden at 0 */}
        {count > 0 && (
          <span
            aria-hidden
            className="absolute top-2 left-2 grid min-w-7 place-items-center rounded-full bg-gold px-1.5 text-xs leading-7 font-bold text-gold-foreground ring-2 ring-primary-foreground max-[759px]:top-1 max-[759px]:left-1 max-[759px]:min-w-6 max-[759px]:text-caption max-[759px]:leading-6"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
      <TripPlannerDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
