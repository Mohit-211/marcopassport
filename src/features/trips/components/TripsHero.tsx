import { HeroBackground } from "@/components/site/HeroBackground";

/** Site-standard photo hero used by the My Trips pages. */
export function TripsHero({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  image = "/assets/place-marina.jpg",
  imageAlt = "Boats in a Marco Island marina",
  actions,
  children,
}: {
  eyebrow: string;
  eyebrowIcon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="hero-viewport">
      <HeroBackground src={image} alt={imageAlt} />
      <div className="hero-container flex-col items-stretch justify-center gap-8 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 max-w-2xl">
          <div className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-5 sm:text-[11px]">
            <span className="h-px w-8 bg-gold/70" />
            {eyebrowIcon}
            {eyebrow}
          </div>
          <h1 className="wrap-break-word font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
            {title}
          </h1>
          {description && (
            <div className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
              {description}
            </div>
          )}
          {children}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </section>
  );
}

/** Outline button style that reads on top of the hero photo. */
export const heroOutlineButton =
  "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground";
