import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { magazines } from "@/data/magazines";
import { CoverMockup } from "@/components/magazine/CoverMockup";

export default function FeaturedEdition({
  featured,
}: {
  featured: (typeof magazines)[number];
}) {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="site-container">
        <div className="grid md:grid-cols-[minmax(0,420px)_1fr] gap-10 lg:gap-16 items-center">
          <Link
            href={`/magazine/${featured.slug}`}
            className="group relative block mx-auto md:mx-0"
          >
            <CoverMockup magazine={featured} large />
          </Link>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              <Sparkles className="h-3.5 w-3.5" /> The current issue · {featured.issue} · {featured.season}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-balance text-primary md:text-4xl">
              {featured.title}
            </h2>
            <p className="font-display text-xl text-foreground/80 mt-3 italic">
              {featured.tagline}
            </p>
            <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
              {featured.letter.slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="gold" size="lg" nativeButton={false} render={<Link href={`/magazine/${featured.slug}`} />}>
                Read now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span>{featured.pages} pages</span>
              <span className="h-1 w-1 rounded-full bg-gold" />
              <span>{featured.sections.length} stories inside</span>
              <span className="h-1 w-1 rounded-full bg-gold" />
              <span>{featured.date}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
