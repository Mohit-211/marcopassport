"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useItineraries } from "../ItinerariesProvider";
import { TripPlannerDialog } from "./TripPlannerDialog";

/** Pages with a fixed bottom action bar below lg (see ListingActionsPanel, PlaceExperience). */
const HAS_MOBILE_ACTION_BAR = /^\/(listings|places)\/[^/]+/;

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

/** Small 4-point star accent beside "ITINERARY". */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden className={className}>
      <path d="M5 0 C5.6 3.4 6.6 4.4 10 5 C6.6 5.6 5.6 6.6 5 10 C4.4 6.6 3.4 5.6 0 5 C3.4 4.4 4.4 3.4 5 0 Z" fill="currentColor" />
    </svg>
  );
}

/** Places in the plan the modal opens on: the guest draft, or the most recently edited itinerary. */
function usePlanCount() {
  const { ready, isAuthenticated, itineraries, draft } = useItineraries();
  if (!ready) return 0;
  if (!isAuthenticated) return draft?.items.length ?? 0;
  const latest = itineraries[0];
  return latest ? (latest.items?.length ?? latest.item_count ?? 0) : 0;
}

/**
 * Floating starfish "Your Itinerary" button, bottom-right on every page;
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
  const countLabel = `${count} ${count === 1 ? "place" : "places"} in your itinerary`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        // The count is part of the name, so screen readers hear it with the button.
        aria-label={count > 0 ? `Open your Passport, ${countLabel}` : "Open your Passport"}
        className={cn(
          "group fixed right-5 z-(--z-floating) size-37 rounded-full outline-none max-[759px]:size-27.5",
          "bottom-[calc(20px+env(safe-area-inset-bottom))]",
          // Sit above the listing/place pages' mobile action bar instead of covering it.
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
          className="absolute inset-0 h-full w-full drop-shadow-[0_8px_16px_rgb(0_0_0/0.28)] transition-[filter] duration-300 group-hover:drop-shadow-[0_10px_22px_color-mix(in_oklab,var(--gold)_45%,transparent)]"
        >
          <defs>
            {/* Lit from the top-left: lighter centre fading to a deeper edge */}
            <radialGradient id={`${uid}-fill`} cx="38%" cy="32%" r="75%">
              <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--primary) 78%, white)" }} />
              <stop offset="55%" style={{ stopColor: "var(--primary)" }} />
              <stop offset="100%" style={{ stopColor: "color-mix(in oklab, var(--primary) 80%, black)" }} />
            </radialGradient>
            {/* Metallic gold for the ring */}
            <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--gold) 60%, white)" }} />
              <stop offset="50%" style={{ stopColor: "var(--gold)" }} />
              <stop offset="100%" style={{ stopColor: "color-mix(in oklab, var(--gold) 70%, black)" }} />
            </linearGradient>
            {/* Soft gloss across the upper arms */}
            <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity={0.22} />
              <stop offset="45%" stopColor="white" stopOpacity={0} />
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

        <span aria-hidden className="relative flex h-full flex-col items-center justify-center pt-[6%] text-primary-foreground">
          <span className="text-[9px] font-semibold tracking-[0.32em] text-gold uppercase dark:text-primary-foreground max-[759px]:text-[7px]">
            Your
          </span>
          <span className="mt-0.5 flex items-center gap-1 max-[759px]:gap-0.5">
            <Sparkle className="size-2 text-gold dark:text-primary-foreground max-[759px]:size-1.5" />
            <span className="font-display text-[13px] leading-none font-bold tracking-[0.02em] uppercase max-[759px]:text-[10px]">
              Passport
            </span>
            <Sparkle className="size-2 text-gold dark:text-primary-foreground max-[759px]:size-1.5" />
          </span>
          <span className="relative mt-4.5 overflow-hidden rounded-full bg-linear-to-b from-[color-mix(in_oklab,var(--gold)_75%,white)] to-gold px-2 py-0.5 text-[6px] font-bold tracking-[0.18em] text-gold-foreground uppercase shadow-[inset_0_-1px_0_rgb(0_0_0/0.15),0_1px_2px_rgb(0_0_0/0.25)] max-[759px]:mt-3 max-[759px]:px-1.5 max-[759px]:text-[6px]">
            Tap to plan
            {/* Periodic shine sweeping across the pill */}
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent motion-safe:animate-[passport-shine_3.5s_ease-in-out_infinite] motion-reduce:hidden" />
          </span>
        </span>

        {/* Count of places in My Plan; hidden at 0 */}
        {count > 0 && (
          <span
            aria-hidden
            className="absolute top-2 left-2 grid min-w-7 place-items-center rounded-full bg-gold px-1.5 text-xs leading-7 font-bold text-gold-foreground ring-2 ring-primary-foreground max-[759px]:top-1 max-[759px]:left-1 max-[759px]:min-w-6 max-[759px]:text-[11px] max-[759px]:leading-6"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
      <TripPlannerDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
