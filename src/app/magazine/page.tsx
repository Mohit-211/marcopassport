import type { Metadata } from "next";
import { CtaSection } from "@/components/site/CtaSection";
import { magazines } from "@/data/magazines";
import MagazineHero from "@/components/magazine/MagazineHero";
import FeaturedEdition from "@/components/magazine/FeaturedEdition";
import MagazineGrid from "@/components/magazine/MagazineGrid";
import ArchiveSection from "@/components/magazine/ArchiveSection";

export const metadata: Metadata = {
  title: "Marco Magazine — The Marco Passport",
  description:
    "Stories, photo essays, and field guides exploring the places, people, food, and character of Marco Island, Florida.",
  openGraph: {
    title: "Marco Magazine — The Marco Passport",
    description:
      "Stories, photo essays, and field guides from around Marco Island, Florida.",
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
      <MagazineHero />
      <FeaturedEdition featured={featured} />

      {/* Current grid */}
      <section className="site-container py-20 md:py-28">
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
      <CtaSection
        eyebrow="Stay in print"
        title="The next issue, in your inbox"
        description="One email per season. New stories, new photographers, no noise."
        actions={[{ label: "Subscribe", href: "/contact" }]}
      />
    </>
  );
}
