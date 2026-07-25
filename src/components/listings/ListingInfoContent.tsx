import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const highlightsByCategory: Record<string, string[]> = {
  "Places to Stay": [
    "Private beach access with cabanas",
    "Three on-site restaurants & sunset bar",
    "Full-service spa and oceanfront pools",
    "Concierge-curated island excursions",
    "Pet-friendly suites available",
    "Complimentary kayaks & paddleboards",
  ],
  "Places to Eat": [
    "Daily catch from Gulf fishermen",
    "Award-winning wine cellar",
    "Waterfront sunset seating",
    "Vegetarian & gluten-free tasting menus",
    "Live acoustic music on weekends",
    "Reservations recommended",
  ],
  "Fun Activities": [
    "USCG-licensed captain & crew",
    "Snorkel gear, snacks & drinks included",
    "Dolphin & manatee sightings most trips",
    "Sunset, half-day & private options",
    "Family- and beginner-friendly",
    "Small groups — 6 guests max",
  ],
};

type ListingInfoContentProps = {
  listing: {
    description: string;
    category: string;
    location: string;
  };
};

export default function ListingInfoContent({
  listing,
}: ListingInfoContentProps) {
  const highlights = highlightsByCategory[listing.category] ?? [];

  return (
    <div className="space-y-14">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
          About
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">
          A taste of the island, perfected.
        </h2>
        <div className="mt-6 space-y-5 text-foreground/80 leading-relaxed text-[17px]">
          <p>
            {listing.description} Nestled along one of Marco Island's most
            coveted stretches, this destination has become a quiet benchmark for
            travelers who care about the details — the slow unfurl of an
            evening, the salt-tinged breeze, the unhurried service.
          </p>
          <p>
            Every element has been considered: locally-sourced ingredients and
            craftsmanship, interiors that nod to the Gulf's palette of sand and
            turquoise, and a team whose warmth turns first-time guests into
            regulars. Whether you're here for an afternoon or a long weekend,
            you'll leave with a story.
          </p>
          <p>
            Open year-round, with seasonal menus and experiences that shift with
            the tides. Reservations and bookings are recommended during high
            season (December–April).
          </p>
        </div>
      </div>

      {highlights.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            What to expect
          </p>
          <h2 className="font-display text-3xl font-semibold mt-2">
            Key highlights
          </h2>
          <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span className="mt-0.5 grid place-items-center h-6 w-6 rounded-full bg-gold/15 text-gold shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-[15px] text-foreground/85">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Info + Map */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Essentials
          </p>
          <h3 className="font-display text-2xl font-semibold mt-2">
            Visit & contact
          </h3>
          <ul className="mt-6 space-y-4 text-sm">
            <InfoRow icon={MapPin} label="Address">
              {listing.location}, Marco Island, FL 34145
            </InfoRow>
            <InfoRow icon={Phone} label="Phone">
              <a
                href="tel:+12395550199"
                className="hover:text-primary transition"
              >
                (239) 555-0199
              </a>
            </InfoRow>
            <InfoRow icon={Mail} label="Email">
              <a
                href="mailto:hello@marcopassport.com"
                className="hover:text-primary transition"
              >
                reservations@marco.com
              </a>
            </InfoRow>
            <InfoRow icon={Clock} label="Hours">
              Mon–Sun · 8:00 AM – 10:00 PM
            </InfoRow>
            <InfoRow icon={Globe} label="Website">
              <a href="#" className="hover:text-primary transition">
                marcopassport.com/visit
              </a>
            </InfoRow>
          </ul>
        </div>

        <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-soft min-h-[320px] relative">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.94_0.02_220),oklch(0.88_0.04_200))]" />
          <svg
            className="absolute inset-0 h-full w-full opacity-50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="oklch(0.78 0.04 220)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute inset-x-0 top-1/3 h-24 bg-[oklch(0.65_0.12_220/0.4)] -skew-y-3" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
            <div className="grid place-items-center h-12 w-12 rounded-full bg-gold text-gold-foreground shadow-elegant animate-pulse">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-background/90 px-3 py-1 rounded-full">
              {listing.location}
            </span>
          </div>
          <div className="absolute bottom-4 right-4">
            <Button size="sm" variant="default">
              Get directions <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid place-items-center h-9 w-9 rounded-full bg-sand text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          {label}
        </p>
        <p className="text-foreground/90">{children}</p>
      </div>
    </li>
  );
}
