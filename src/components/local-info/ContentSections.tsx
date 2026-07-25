import { Sun, Car, Compass, Sparkles, Waves } from "lucide-react";

export const sections = [
  {
    id: "about",
    eyebrow: "01 — About",
    title: "About Marco Island",
    image: "/assets/place-sunset.jpg",
    body: [
      "Tucked at the northern edge of Florida's Ten Thousand Islands, Marco is the largest of a chain of barrier islands fringed by white-sand beaches and shallow, sun-warmed gulf water.",
      "It's small enough to feel like a village and polished enough to feel like a resort — a quiet rhythm of marinas, mangroves, and long, slow sunsets.",
    ],
    icon: Waves,
  },
  {
    id: "when",
    eyebrow: "02 — When to go",
    title: "Best Time to Visit",
    image: "/assets/place-tigertail.jpg",
    body: [
      "High season runs December through April: dry, breezy, and consistently in the high 70s. Expect busier beaches and book early.",
      "May and November are the sweet spots — warm water, fewer crowds, softer prices. Summer is lush and humid with daily afternoon storms that pass quickly.",
    ],
    icon: Sun,
    bullets: [
      "Dec–Apr · Peak season, 70–80°F",
      "May & Nov · Shoulder, best value",
      "Jun–Oct · Warm, wet, quieter",
    ],
  },
  {
    id: "around",
    eyebrow: "03 — Logistics",
    title: "Getting Around",
    image: "/assets/place-marina.jpg",
    body: [
      "Most visitors fly into Southwest Florida International (RSW), about 50 minutes north. Naples Airport (APF) is closer for private travel.",
      "A car is the easiest way to explore — the island is compact but parking is plentiful. Trolleys, bikes, and rideshare cover the rest.",
    ],
    icon: Car,
    bullets: [
      "RSW airport · ~50 min drive",
      "Marco Island Trolley · daily loop",
      "Bikes & e-scooters · island-wide rentals",
    ],
  },
  {
    id: "tips",
    eyebrow: "04 — Travel tips",
    title: "Travel Tips",
    image: "/assets/place-caxambas.jpg",
    body: [
      "Mornings belong to the beach — calmer water, softer light, and the chance to spot dolphins close to shore.",
      "Pack reef-safe sunscreen, a light layer for breezy evenings, and reservations for sunset dining on weekends.",
    ],
    icon: Compass,
  },
  {
    id: "culture",
    eyebrow: "05 — Local culture",
    title: "Local Culture",
    image: "/assets/place-museum.jpg",
    body: [
      "Marco's identity is woven from Calusa heritage, a fishing-village past, and a quiet, design-forward present.",
      "Expect a calmer Florida — gallery openings, dockside seafood, live music at golden hour, and a community that takes its sunsets seriously.",
    ],
    icon: Sparkles,
  },
];

export function ContentSections() {
  return (
    <div className="bg-background">
      {sections.map((section, idx) => {
        const Icon = section.icon;
        const reverse = idx % 2 === 1;
        return (
          <section
            key={section.id}
            id={section.id}
            className="container mx-auto px-5 lg:px-8 py-16 md:py-24 scroll-mt-32"
          >
            <div
              className={`grid md:grid-cols-2 gap-10 lg:gap-16 items-center ${
                reverse ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div>
                <div className="overflow-hidden rounded-2xl shadow-soft">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-[340px] md:h-[460px] object-cover hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#EBBD00] font-semibold mb-3">
                  {section.eyebrow}
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#002E50] leading-tight flex items-center gap-3">
                  <span className="grid place-items-center h-10 w-10 rounded-full bg-[#002E50]/5 text-[#002E50]">
                    <Icon className="h-5 w-5" />
                  </span>
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-foreground/80 leading-relaxed text-[15px] md:text-base">
                  {section.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-6 space-y-2.5">
                    {section.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-sm text-foreground/85"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#EBBD00] shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
