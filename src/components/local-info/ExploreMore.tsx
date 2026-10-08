import Link from "next/link";
import { Info, ArrowRight } from "lucide-react";
import { CtaSection } from "@/components/site/CtaSection";

const cards = [
  {
    href: "/places",
    title: "Places to visit",
    text: "Beaches, parks, and the natural wonders that define Marco.",
    image: "/assets/place-caxambas.jpg",
  },
  {
    href: "/explore",
    title: "Explore listings",
    text: "Find places to stay, dine, shop, and experience the best of Marco Island.",
    image: "/assets/place-marina.jpg",
  },
  {
    href: "/blog",
    title: "Stories & guides",
    text: "Long-form reads on culture, food, and island life.",
    image: "/assets/place-museum.jpg",
  },
];

export function ExploreMore() {
  return (
    <>
    <section className="bg-background py-20 md:py-28">
      <div className="site-container">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#EBBD00] font-semibold mb-3">
              Keep exploring
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#002E50] leading-tight">
              Go deeper into the island
            </h2>
          </div>
          <Info className="h-6 w-6 text-[#002E50]/40 hidden md:block" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group block rounded-2xl overflow-hidden border border-border bg-card hover:shadow-soft transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-[#002E50]">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                  {c.text}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#EBBD00]">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <CtaSection
      title="Plan your trip in your Passport"
      description="Save places, set dates, and build a simple itinerary you can take with you."
      actions={[{ label: "Open your Passport", href: "/passport" }]}
    />
    </>
  );
}
