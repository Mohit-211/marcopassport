import Link from "next/link";
import { ArrowRight, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { magazines } from "@/data/magazines";
import { CoverMockup } from "@/components/magazine/CoverMockup";

export default function FeaturedEdition({
  featured,
}: {
  featured: (typeof magazines)[number];
}) {
  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              <Sparkles className="inline h-3.5 w-3.5 -mt-0.5 mr-1" /> The
              current issue
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 text-balance">
              Featured edition
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-right">
            Out now — {featured.season}
          </p>
        </div>
        <div className="grid md:grid-cols-[minmax(0,420px)_1fr] gap-10 lg:gap-16 items-center">
          <Link
            href={`/magazine/${featured.slug}`}
            className="group relative block mx-auto md:mx-0"
          >
            <CoverMockup magazine={featured} large />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              {featured.issue} · {featured.season}
            </p>
            <h3 className="font-display text-4xl md:text-6xl font-semibold mt-3 text-balance">
              {featured.title}
            </h3>
            <p className="text-xl text-foreground/80 mt-4 italic">
              {featured.tagline}
            </p>
            <div className="mt-8 space-y-4 text-foreground/80 leading-relaxed text-lg">
              {featured.letter.slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={`/magazine/${featured.slug}`}>
                <Button variant="gold" size="lg">
                  Read now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Bookmark className="h-4 w-4" /> Save for later
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
