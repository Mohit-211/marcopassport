import type { Metadata } from "next";
import Image from "next/image";
import { Info } from "lucide-react";
import { LocalStats } from "@/components/local-info/LocalStats";
import {
  ContentSections,
  sections,
} from "@/components/local-info/ContentSections";
import { ExploreMore } from "@/components/local-info/ExploreMore";
import { QuickTips } from "@/components/local-info/QuickTips";

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
      <section className="relative isolate h-[78vh] overflow-hidden bg-primary text-primary-foreground">
        {/* Background */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="/assets/hero-marco-island.jpg"
            alt="Aerial view of Marco Island, Florida"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        {/* Image treatment */}
        <div className="absolute inset-0 -z-10 bg-primary/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/85 via-primary/40 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/70 via-transparent to-primary/10" />

        {/* Content */}
        <div className="mx-auto flex h-full max-w-7xl items-center px-6 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-5 sm:text-[11px]">
              <span className="h-px w-8 bg-gold/70" />
              <Info className="h-3.5 w-3.5" />
              Local Info
            </div>
            {/* Heading */}
            <h1 className="whitespace-nowrap font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em]">
              Discover <span className="italic text-gold">Marco Island</span>
            </h1>
            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
              A practical, friendly guide to the island. Learn when to visit,
              how to get around, and the little things that make every trip feel
              effortless.
            </p>
          </div>
        </div>
      </section>

      <LocalStats />

      {/* Section Navigation */}
      <section className="sticky top-[72px] z-30 border-y border-border bg-background/90 shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-center gap-1 overflow-x-auto py-3">
            {sections.map((section) => (
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
      <QuickTips />
      <ExploreMore />
    </>
  );
}
