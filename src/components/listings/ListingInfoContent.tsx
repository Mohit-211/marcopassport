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

type ListingInfoContentProps = {
  listing: {
    name: string;
    description: string;
    category: string;
    location: string;
    about?: string;
    address?: string;
    phone?: string;
    email?: string;
    hours?: string;
    website_url?: string;
    highlights?: string;
  };
};

function parseHighlights(highlights?: string): string[] {
  if (!highlights) return [];
  return highlights
    .split(/\r?\n|,/)
    .map((h) => h.trim())
    .filter(Boolean);
}

export default function ListingInfoContent({
  listing,
}: ListingInfoContentProps) {
  const highlights = parseHighlights(listing.highlights);
  const websiteHost = listing.website_url
    ? listing.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : undefined;

  return (
    <div className="space-y-14">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
          About
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">
          {listing.name}
        </h2>
        <div className="mt-6 space-y-5 text-foreground/80 leading-relaxed text-[17px]">
          {(listing.about ?? listing.description)
            .split(/\r?\n+/)
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
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
              {listing.address || listing.location || "Marco Island, FL"}
            </InfoRow>
            {listing.phone && (
              <InfoRow icon={Phone} label="Phone">
                <a
                  href={`tel:${listing.phone}`}
                  className="hover:text-primary transition"
                >
                  {listing.phone}
                </a>
              </InfoRow>
            )}
            {listing.email && (
              <InfoRow icon={Mail} label="Email">
                <a
                  href={`mailto:${listing.email}`}
                  className="hover:text-primary transition"
                >
                  {listing.email}
                </a>
              </InfoRow>
            )}
            {listing.hours && (
              <InfoRow icon={Clock} label="Hours">
                {listing.hours}
              </InfoRow>
            )}
            {listing.website_url && (
              <InfoRow icon={Globe} label="Website">
                <a
                  href={listing.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition"
                >
                  {websiteHost}
                </a>
              </InfoRow>
            )}
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
