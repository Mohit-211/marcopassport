import type { Metadata } from "next";
import { Info } from "lucide-react";
import { LocalStats } from "@/components/local-info/LocalStats";
import {
  ContentSections,
  sections,
} from "@/components/local-info/ContentSections";
import { ExploreMore } from "@/components/local-info/ExploreMore";
import { QuickTips } from "@/components/local-info/QuickTips";
import EditorialGuide from "@/components/local-info/EditorialGuide";
import { PageHero } from "@/components/site/PageHero";

// The content sections, then the editorial guide below them.
const navItems = [
  ...sections.map(({ id, title }) => ({ id, title })),
  { id: "guide", title: "The Guide" },
];

export const metadata: Metadata = {
  title: "Local Info | The Marco Passport",
  description:
    "Everything you need to know about Marco Island, Florida. When to visit, how to get around, local culture, and insider tips.",
  openGraph: {
    title: "Local Info | The Marco Passport",
    description:
      "A practical, friendly guide to Marco Island. Weather, transportation, culture, and the small things that make every trip easier.",
  },
};

export default async function LocalInfoPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        image="/assets/hero-marco-island.jpg"
        imageAlt="Aerial view of Marco Island, Florida"
        icon={Info}
        eyebrow="Local Info"
        title={
          <>
            Discover <span className="italic text-gold">Marco Island</span>
          </>
        }
        description="A practical, friendly guide to the island. Learn when to visit, how to get around, and the little things that make every trip feel effortless."
      />

      <LocalStats />

      {/* Section Navigation */}
      <section className="sticky top-(--header-height) z-30 border-y border-border bg-background/90 shadow-soft backdrop-blur-md">
        <div className="site-container">
          <div className="flex items-center justify-center gap-1 overflow-x-auto py-3">
            {navItems.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="whitespace-nowrap px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <ContentSections />
      <EditorialGuide />
      <QuickTips />
      <ExploreMore />
    </>
  );
}
