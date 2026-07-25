import { ArrowUpRight } from "lucide-react";
import { magazines } from "@/data/magazines";
import { cn } from "@/lib/utils";

export function CoverMockup({
  magazine,
  large = false,
}: {
  magazine: (typeof magazines)[number];
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative transition-transform duration-500 group-hover:-translate-y-2",
        large
          ? "drop-shadow-[0_30px_60px_oklch(0.22_0.06_240/0.35)]"
          : "drop-shadow-[0_18px_40px_oklch(0.22_0.06_240/0.25)]"
      )}
    >
      {/* Spine shadow */}
      <div className="absolute left-0 top-1.5 bottom-1.5 w-2 bg-gradient-to-r from-black/40 to-transparent rounded-l-md" />
      <div className="relative aspect-[2/3] overflow-hidden rounded-md ring-1 ring-foreground/10 bg-primary">
        <img
          src={magazine.cover}
          alt={`${magazine.title} ${magazine.issue}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {/* Cover masthead overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-primary/30" />
        <div className="absolute top-0 inset-x-0 p-5 flex items-center justify-between text-primary-foreground">
          <span className="font-display text-sm md:text-base tracking-[0.18em] uppercase">
            Marco
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-gold">
            {magazine.issue}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold/90">
            {magazine.season}
          </p>
          <p
            className={cn(
              "font-display font-semibold leading-[0.95] mt-1.5 text-balance",
              large ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"
            )}
          >
            {magazine.title}
          </p>
          <p
            className={cn(
              "italic text-primary-foreground/85 mt-2",
              large ? "text-base" : "text-xs"
            )}
          >
            {magazine.tagline}
          </p>
        </div>
        {/* Glossy sheen */}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,oklch(1_0_0/0.12)_50%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
      {/* Read overlay (hover) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="inline-flex items-center gap-2 bg-gold text-gold-foreground text-xs font-semibold uppercase tracking-[0.2em] px-5 py-3 rounded-full shadow-elegant">
          Read magazine <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
