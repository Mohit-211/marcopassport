import {
  ArrowUpRight,
  Camera,
  Clock,
  Compass,
  CreditCard,
  Leaf,
  MapPin,
  ParkingCircle,
  Sparkles,
  Sun,
  Users,
  Waves,
} from "lucide-react";
import type { Place, PlaceExpectation } from "@/data/places";

const iconMap = {
  sun: Sun,
  wave: Waves,
  family: Users,
  camera: Camera,
  leaf: Leaf,
  compass: Compass,
  sparkle: Sparkles,
} as const;

export default function PlaceStoryContent({ place }: { place: Place }) {
  return (
    <div className="space-y-16">
      {/* Story */}
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
          The story
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance">
          Why people return here
        </h2>
        <div className="mt-8 space-y-6 text-foreground/80 leading-relaxed text-lg">
          {place.story.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "first-letter:font-display first-letter:text-5xl first-letter:font-semibold first-letter:text-primary first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]"
                  : ""
              }
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* What to expect */}
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
          What to expect
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance">
          The vibe, at a glance
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {place.expectations.map((e) => (
            <ExpectationCard key={e.label} item={e} />
          ))}
        </div>
      </div>

      {/* Practical info */}
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
          Practical info
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance">
          Before you go
        </h2>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <InfoRow icon={MapPin} label="Address" value={place.info.address} />
          <InfoRow icon={Clock} label="Hours" value={place.info.hours} />
          <InfoRow icon={CreditCard} label="Fees" value={place.info.fee} />
          <InfoRow
            icon={ParkingCircle}
            label="Parking"
            value={place.info.parking}
          />
        </div>

        {/* Map placeholder */}
        <div className="mt-6 relative aspect-[16/7] rounded-3xl overflow-hidden bg-primary shadow-elegant">
          <svg
            className="absolute inset-0 h-full w-full opacity-40"
            viewBox="0 0 400 175"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="oklch(0.85 0.05 80 / 0.3)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="400" height="175" fill="url(#grid)" />
            <path
              d="M 0 100 Q 100 60, 200 90 T 400 80"
              stroke="oklch(0.85 0.05 80 / 0.6)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 50 175 L 50 110 Q 120 90, 200 105 L 200 175 Z"
              fill="oklch(0.85 0.05 80 / 0.15)"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground">
            <div className="grid place-items-center h-14 w-14 rounded-full bg-gold text-gold-foreground shadow-elegant animate-pulse">
              <MapPin className="h-7 w-7" />
            </div>
            <p className="mt-3 font-display text-xl">{place.name}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/70 mt-1">
              Marco Island, FL
            </p>
            {/* External link — intentionally a plain <a>, not next/link */}

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(place.info.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold hover:underline"
            >
              Open in maps
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8">
          <h3 className="font-display text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" /> Insider tips
          </h3>
          <ul className="mt-4 space-y-3">
            {place.info.tips.map((t, i) => (
              <li key={i} className="flex gap-3 text-foreground/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ExpectationCard({ item }: { item: PlaceExpectation }) {
  const Icon = iconMap[item.icon];
  return (
    <div className="group rounded-3xl border border-border bg-card p-5 hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-300">
      <div className="grid place-items-center h-11 w-11 rounded-2xl bg-gold/15 text-primary group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 font-display text-lg font-semibold">{item.label}</p>
      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
        {item.detail}
      </p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="grid place-items-center h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="font-medium text-foreground leading-snug mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
