import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlaceCard } from "@/lib/place";
import type { blogPosts } from "@/data/content";

export default function NearbyAndRelated({
  nearby,
  related,
}: {
  nearby: PlaceCard[];
  related: (typeof blogPosts)[number][];
}) {
  return (
    <>
      {/* Nearby */}
      <section className="bg-sand py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                Continue exploring
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance">
                You may also love
              </h2>
            </div>
            <Link href="/places" className="hidden md:inline-block">
              <Button variant="outline">See all places</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {nearby.map((p) => (
              <Link
                key={p.id}
                href={`/places/${p.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-background/90 text-foreground text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full">
                  {p.tag}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-primary-foreground">
                  <h3 className="font-display text-xl md:text-2xl font-semibold leading-tight">
                    {p.name}
                  </h3>
                  <p className="text-sm text-primary-foreground/85 mt-1 line-clamp-2">
                    {p.blurb}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related reads */}
      <section className="container mx-auto px-5 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              From the journal
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance">
              Related reads
            </h2>
          </div>
          <Link href="/blog" className="hidden md:inline-block">
            <Button variant="ghost">
              All articles <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {related.map((b) => (
            <Link
              key={b.slug}
              href="/blog"
              className="group block rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-elegant transition-all duration-500"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={b.image}
                  alt={b.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {b.date} · {b.read}
                </p>
                <h3 className="font-display text-xl font-semibold mt-2 text-balance group-hover:text-primary transition-colors">
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {b.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
