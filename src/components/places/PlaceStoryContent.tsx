import {
  ArrowUpRight,
  Check,
  Clock,
  CreditCard,
  Lightbulb,
  MapPin,
  ParkingCircle,
  Sparkles,
} from "lucide-react";
import type { PlaceDetail } from "@/lib/place";
import { splitTextField } from "@/lib/place";
export default function PlaceStoryContent({ place }: { place: PlaceDetail }) {
  const aboutParagraphs = splitTextField(place.about);
  const tips =
    typeof place.insiderTips === "string"
      ? JSON.parse(place.insiderTips)
      : place.insiderTips || [];
  const infoRows = [
    { icon: MapPin, label: "Address", value: place.address },
    { icon: Clock, label: "Hours", value: place.hours },
    { icon: CreditCard, label: "Fees", value: place.fees ?? place.priceLevel },
    { icon: ParkingCircle, label: "Parking", value: place.parking },
  ].filter((row) => row.value);
  const expectItems =
    typeof place.whatToExpect === "string"
      ? JSON.parse(place.whatToExpect)
      : place.whatToExpect || [];
  return (
    <div className="space-y-16">
      {/* Story */}
      {aboutParagraphs.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
            The story
          </p>
          <div className="mt-8 space-y-6 text-foreground/80 leading-relaxed text-lg">
            <p
              className={
                "first-letter:font-display first-letter:text-5xl first-letter:font-semibold first-letter:text-primary first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]"
              }
              dangerouslySetInnerHTML={{ __html: place.about }} />
          </div>
        </div>
      )}

      {/* What to expect */}
      {/* What to expect */}
      {expectItems.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
            What to expect
          </p>

          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance">
            The vibe, at a glance
          </h2>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {expectItems.map(
              (
                item: {
                  title: string;
                  description: string;
                },
                i: number
              ) => (
                <div
                  key={i}
                  className="group rounded-3xl border border-border bg-card p-5 hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Icon */}
                  {/* <div className="grid place-items-center h-11 w-11 rounded-2xl bg-gold/15 text-primary group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
              <Check className="h-5 w-5" />
            </div> */}

                  {/* Title */}
                  <p className="mt-4 font-display text-lg font-semibold">
                    {item.title}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Practical info */}
      {(infoRows.length > 0 || tips.length > 0) && (
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
            Practical info
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance">
            Before you go
          </h2>
          {infoRows.length > 0 && (
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              {infoRows.map((row) => (
                <InfoRow
                  key={row.label}
                  icon={row.icon}
                  label={row.label}
                  value={row.value as string}
                />
              ))}
            </div>
          )}
          {/* Map placeholder */}
          {place.address && (
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
                  href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold hover:underline"
                >
                  Open in maps
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}
          {/* Tips */}
          {/* Tips */}
          {tips.length > 0 && (
            <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/10 p-5 flex gap-4">
              <Lightbulb className="h-5 w-5 text-gold-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gold-foreground">
                  Insider tip
                </p>

                <ul className="mt-4 space-y-3">
                  {tips.map((tip: string, i: number) => (
                    <li
                      key={i}
                      className="flex gap-3 text-foreground/85"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />

                      <span className="text-sm text-primary mt-1 leading-relaxed" >
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {tips.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                Insider tips
              </h3>

              <ul className="mt-4 space-y-3">
                {tips.map((tip: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-3 text-foreground/85"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />

                    <span className="leading-relaxed">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
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