import type { Magazine } from "@/data/magazines";

export default function CoverArt({ magazine }: { magazine: Magazine }) {
  return (
    <div className="relative mx-auto md:mx-0 w-full max-w-[360px]">
      <div className="absolute left-0 top-1.5 bottom-1.5 w-2 bg-gradient-to-r from-black/40 to-transparent rounded-l-md" />
      <div className="relative aspect-[2/3] overflow-hidden rounded-md ring-1 ring-primary-foreground/10 shadow-elegant">
        <img
          src={magazine.cover}
          alt={`${magazine.title} ${magazine.issue}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-primary/30" />
        <div className="absolute top-0 inset-x-0 p-5 flex items-center justify-between">
          <span className="font-display text-base tracking-[0.18em] uppercase">
            Marco
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-gold">
            {magazine.issue}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold/90">
            {magazine.season}
          </p>
          <p className="font-display font-semibold leading-[0.95] text-4xl mt-1.5 text-balance">
            {magazine.title}
          </p>
          <p className="italic text-primary-foreground/85 mt-2 text-sm">
            {magazine.tagline}
          </p>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,oklch(1_0_0/0.08)_50%,transparent_60%)] pointer-events-none" />
      </div>
    </div>
  );
}
