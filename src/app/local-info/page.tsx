import type { Metadata } from "next";
import Image from "next/image";

import {
  ContentSections,
  sections,
} from "@/components/local-info/ContentSections";
import { ExploreMore } from "@/components/local-info/ExploreMore";
import { QuickTips } from "@/components/local-info/QuickTips";

export const metadata: Metadata = {
  title: "Local Info | Marco Passport",
  description:
    "Everything you need to know about Marco Island, Florida. When to visit, how to get around, local culture, and insider tips.",
  openGraph: {
    title: "Local Info | Marco Passport",
    description:
      "A practical, friendly guide to Marco Island. Weather, transportation, culture, and the small things that make every trip easier.",
  },
};

export default function LocalInfoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[72vh] min-h-[520px] overflow-hidden">
        <Image
          src="/assets/hero-marco-island.jpg"
          alt="Aerial view of Marco Island, Florida"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#002E50]/40 via-[#002E50]/20 to-[#002E50]/80" />

        <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-5 pb-16 lg:px-8 lg:pb-24">
          <div className="max-w-2xl text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EBBD00]" />
              Local Info
            </div>

            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Discover <span className="text-[#EBBD00]">Marco Island</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              A practical, friendly guide to the island. Learn when to visit,
              how to get around, and the little things that make every trip feel
              effortless.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-background">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-5 py-6 lg:grid-cols-4 lg:px-8">
          {[
            { k: "Avg. Winter", v: "75°F" },
            { k: "Best Months", v: "Dec – Apr" },
            { k: "Nearest Airport", v: "RSW · 50 min" },
            { k: "Beach Length", v: "4 Miles" },
          ].map((stat) => (
            <div key={stat.k}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {stat.k}
              </p>

              <p className="mt-1 font-display text-xl font-semibold text-[#002E50] md:text-2xl">
                {stat.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section Navigation */}
      <section className="sticky top-[72px] z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container mx-auto overflow-x-auto px-5 py-3 lg:px-8">
          <div className="flex min-w-max items-center gap-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="whitespace-nowrap px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-[#002E50]"
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
