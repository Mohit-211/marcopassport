import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { magazines } from "@/data/magazines";
import MagazineHero from "@/components/magazine/MagazineHero";
import FeaturedEdition from "@/components/magazine/FeaturedEdition";
import MagazineGrid from "@/components/magazine/MagazineGrid";
import ArchiveSection from "@/components/magazine/ArchiveSection";

export const metadata: Metadata = {
  title: "Marco Magazine — Marco Passport",
  description:
    "A curated collection of digital editions — long-form journalism, photo essays and field guides from across Marco Island, Florida.",
  openGraph: {
    title: "Marco Magazine — Marco Passport",
    description:
      "A curated collection of digital editions from Marco Island, Florida.",
    images: ["/assets/places-hero.jpg"],
  },
};

export default function MagazinePage() {
  const featured = magazines.find((m) => m.featured) ?? magazines[0];
  const current = magazines.filter(
    (m) => !m.archived && m.slug !== featured.slug
  );
  const archive = magazines.filter((m) => m.archived);

  return (
    <>
      <MagazineHero featured={featured} />
      <FeaturedEdition featured={featured} />

      {/* Current grid */}
      <section className="container mx-auto px-5 lg:px-8 py-20 md:py-28">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              The collection
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 text-balance">
              On the shelf
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-right">
            Each edition is a self-contained guide. Read in any order.
          </p>
        </div>
        <MagazineGrid magazines={[featured, ...current]} />
      </section>

      <ArchiveSection archive={archive} />

      {/* CTA */}
      <section className="container mx-auto px-5 lg:px-8 py-20 md:py-28">
        <div className="rounded-[2rem] bg-sand p-10 md:p-16 grid md:grid-cols-[1fr_auto] items-center gap-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              Stay in print
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance max-w-2xl">
              The next issue, in your inbox
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              One email per season. New stories, new photographers, no noise.
            </p>
          </div>
          <Link href="/contact" className="relative">
            <Button variant="gold" size="lg">
              Subscribe <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
