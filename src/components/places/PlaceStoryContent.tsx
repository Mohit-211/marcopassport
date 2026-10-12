import { Lightbulb } from "lucide-react";
import type { PlaceDetail } from "@/lib/place";
import { parseExpectItems, parseTips } from "@/lib/place";

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-primary md:text-3xl">{title}</h2>
    </div>
  );
}

/** The editorial part of a place page: about, what to expect, insider tips. */
export default function PlaceStoryContent({ place }: { place: PlaceDetail }) {
  const expectItems = parseExpectItems(place.whatToExpect);
  const tips = parseTips(place.insiderTips);

  return (
    <>
      {place.about && (
        <section className="space-y-5">
          <SectionHeading eyebrow="The story" title={`About ${place.name}`} />
          {/* Rich text from the admin editor; .blog-content styles its tags. */}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: place.about }} />
        </section>
      )}

      {expectItems.length > 0 && (
        <section className="space-y-6">
          <SectionHeading eyebrow="What to expect" title="The vibe, at a glance" />
          <div className="grid gap-4 sm:grid-cols-2">
            {expectItems.map((item, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-display text-lg font-semibold text-primary">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {tips.length > 0 && (
        <section className="rounded-3xl bg-sand p-6 sm:p-7">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <Lightbulb className="h-4 w-4 text-gold" /> Insider tips
          </p>
          <ul className="mt-4 space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
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
