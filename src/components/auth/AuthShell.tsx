import type { ReactNode } from "react";
import { Bookmark, CalendarCheck, Compass, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const HIGHLIGHTS = [
  {
    icon: Bookmark,
    label: "Save the places you love",
    detail: "Restaurants, beaches and shops, kept in one list.",
  },
  {
    icon: CalendarCheck,
    label: "Plan visits around your stay",
    detail: "Line up what to see before you arrive.",
  },
  {
    icon: Compass,
    label: "Build your island passport",
    detail: "Collect stamps as you explore Marco Island.",
  },
  {
    icon: MapPin,
    label: "Local picks, always current",
    detail: "Guides and stories from the magazine, in one place.",
  },
];

/**
 * Shared layout for every /auth page: editorial brand panel on the left (md+),
 * form on the right. Rendered on the server so the shell paints before any JS
 * loads. On mobile only a one-line intro sits above the form.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <section className="auth-shell flex min-h-svh bg-background pt-20">
      <div className="grid w-full md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-cols-2">
        {/* Brand content — text-led, with a faint stamp motif instead of imagery */}
        <aside className="relative hidden overflow-hidden border-r border-border/60 bg-cream/40 md:flex md:items-center md:justify-end md:px-8 md:py-12 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border border-gold/50"
          >
            <div className="absolute inset-6 rounded-full border border-dashed border-gold/40" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 right-10 h-40 w-40 rounded-full border border-primary/10"
          />

          <div className="relative w-full max-w-md text-primary">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              <span className="h-px w-8 bg-gold" />
              The Marco Passport
            </div>

            <p className="mt-5 font-display text-4xl font-medium leading-[1.04] tracking-[-0.03em] lg:mt-6 lg:text-5xl">
              Your <span className="italic text-primary-soft">passport</span>
              <br />
              to the island.
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground lg:mt-5 lg:text-base lg:leading-7">
              One account for everything you discover on Marco Island — your
              favourite spots, stories and plans, ready whenever you are.
            </p>

            <ul className="mt-8 space-y-4 lg:mt-10 lg:space-y-5">
              {HIGHLIGHTS.map(({ icon: Icon, label, detail }) => (
                <li key={label} className="flex items-start gap-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/60 bg-card text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="pt-0.5">
                    <span className="block text-sm font-medium leading-8 text-primary lg:leading-5">
                      {label}
                    </span>
                    <span className="mt-0.5 hidden text-[13px] leading-5 text-muted-foreground lg:block">
                      {detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-10 flex items-center gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground lg:mt-12">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              Free to join · Made for Marco Island visitors and locals
            </p>
          </div>
        </aside>

        {/* Form column */}
        <div className="flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-10 md:items-start md:px-8 lg:px-16">
          {/* Mobile-only intro so the brand still reads without pushing the form down */}
          <div className="mb-5 w-full max-w-[440px] md:hidden">
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              <span className="h-px w-6 bg-gold" />
              The Marco Passport
            </div>
            <p className="mt-2 font-display text-xl font-medium tracking-[-0.02em] text-primary">
              Your <span className="italic text-primary-soft">passport</span>{" "}
              to the island.
            </p>
          </div>
          <div className="w-full max-w-[440px]">{children}</div>
        </div>
      </div>
    </section>
  );
}

/** The card every auth form sits in, so all /auth pages share one surface. */
export function AuthCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-6 shadow-elegant sm:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Same footprint as a single-field auth card, to avoid layout shift. */
export function AuthCardSkeleton() {
  return (
    <AuthCard>
      <div aria-busy="true" aria-label="Loading">
        <Skeleton className="h-8 w-3/5 rounded-lg" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
        <Skeleton className="mt-8 h-4 w-16" />
        <Skeleton className="mt-2 h-12 w-full rounded-xl" />
        <Skeleton className="mt-6 h-12 w-full rounded-full" />
      </div>
    </AuthCard>
  );
}
