import { Check, Lightbulb } from "lucide-react";
import type { ExploreDetail } from "@/lib/explore-detail";

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="eyebrow text-gold">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold text-primary md:text-3xl">{title}</h2>
    </div>
  );
}

/** The editorial part of a place's page: about, highlights, what to expect, insider tips. */
export default function ExploreDetailContent({ place }: { place: ExploreDetail }) {
  return (
    <>
      {place.about && (
        <section className="space-y-5">
          <SectionHeading eyebrow="Overview" title={`About ${place.name}`} />
          {/* Rich text from the admin editor; .blog-content styles its tags. */}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: place.about }} />
        </section>
      )}

      {place.highlights.length > 0 && (
        <section className="space-y-6">
          <SectionHeading eyebrow="Highlights" title="Key highlights" />
          <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {place.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-foreground/85">{highlight}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {place.whatToExpect.length > 0 && (
        <section className="space-y-6">
          <SectionHeading eyebrow="What to expect" title="The vibe, at a glance" />
          <div className="grid gap-4 sm:grid-cols-2">
            {place.whatToExpect.map((item, i) => (
              <div key={i} className="rounded-card border border-border bg-card p-5">
                <p className="font-display text-lg font-semibold text-primary">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {place.insiderTips.length > 0 && (
        <section className="rounded-card bg-sand p-6 sm:p-7">
          <p className="eyebrow flex items-center gap-2 text-primary">
            <Lightbulb className="h-4 w-4 text-gold" /> Insider tips
          </p>
          <ul className="mt-4 space-y-3">
            {place.insiderTips.map((tip, i) => (
              <li key={i} className="flex gap-3 leading-relaxed text-foreground/85">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
