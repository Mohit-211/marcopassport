import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CtaAction = {
  label: string;
  href: string;
};

type CtaSectionProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** First action is primary (gold), the second — if any — is secondary. */
  actions?: CtaAction[];
  /** Replaces the action buttons in the right column, e.g. a form. */
  aside?: ReactNode;
  /** Full-width content below, e.g. a feature list. */
  children?: ReactNode;
  headingLevel?: "h2" | "h3";
};

/**
 * Shared call-to-action card (based on the Magazine page CTA). Every CTA on
 * the site uses this so background, typography, buttons and spacing match.
 */
export function CtaSection({
  eyebrow,
  title,
  description,
  actions = [],
  aside,
  children,
  headingLevel: Heading = "h2",
}: CtaSectionProps) {
  return (
    <section className="site-container py-20 md:py-28">
      <div className="rounded-[2rem] bg-sand p-10 md:p-16 grid md:grid-cols-[1fr_auto] items-center gap-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative">
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              {eyebrow}
            </p>
          )}
          <Heading className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance max-w-2xl">
            {title}
          </Heading>
          {description && (
            <p className="text-muted-foreground mt-4 max-w-xl">{description}</p>
          )}
        </div>

        {aside ? (
          <div className="relative">{aside}</div>
        ) : (
          actions.length > 0 && (
            <div className="relative flex flex-wrap gap-3">
              {actions.map((action, i) => (
                <Button
                  key={action.href}
                  variant={i === 0 ? "gold" : "outline"}
                  size="lg"
                  nativeButton={false}
                  render={<Link href={action.href} />}
                >
                  {action.label}
                  {i === 0 && <ArrowRight className="h-4 w-4" />}
                </Button>
              ))}
            </div>
          )
        )}

        {children && <div className="relative md:col-span-2">{children}</div>}
      </div>
    </section>
  );
}
