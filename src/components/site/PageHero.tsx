import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { HeroBackground } from "@/components/site/HeroBackground";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  image: string;
  /** Leave empty for purely decorative images. */
  imageAlt?: string;
  eyebrow: ReactNode;
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  /** Search box, buttons or a meta line under the description. */
  children?: ReactNode;
  /** "full" fills the viewport (default); "compact" is for working screens such as the passport editor. */
  size?: "full" | "compact";
  className?: string;
};

/**
 * The one page hero used across the site: photo + navy overlay, gold eyebrow,
 * display heading and short description. Use it instead of hand-writing a
 * hero so every page keeps the same type scale, spacing and colours.
 */
export function PageHero({
  image,
  imageAlt,
  eyebrow,
  icon: Icon,
  title,
  description,
  children,
  size = "full",
  className,
}: PageHeroProps) {
  return (
    <section className={cn("hero-viewport", size === "compact" && "hero-viewport--compact", className)}>
      <HeroBackground src={image} alt={imageAlt} />
      <div className="hero-container">
        <div className="min-w-0 max-w-3xl">
          <div className="eyebrow mb-4 flex items-center gap-3 text-gold sm:mb-5">
            <span className="h-px w-8 bg-gold/70" />
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {eyebrow}
          </div>
          <h1 className="text-display wrap-break-word font-medium text-balance">
            {title}
          </h1>
          {description && (
            <div className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
              {description}
            </div>
          )}
          {children && <div className="mt-6 sm:mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

/** Gold "·"-separated meta line, e.g. "24 places · Beaches · Nature". */
export function HeroMeta({ items }: { items: ReactNode[] }) {
  return (
    <div className="eyebrow flex flex-wrap items-center gap-3 text-primary-foreground/70">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-3">
          {i > 0 && <span className="h-1 w-1 rounded-full bg-gold" />}
          {item}
        </span>
      ))}
    </div>
  );
}
