import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Check,
  CreditCard,
  ParkingCircle,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { LocationCard } from "@/components/site/LocationCard";
import { parseExpectItems, parseHighlights, parseTips } from "@/lib/place";
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
    highlights?: string | null;
    fees?: string | null;
    parking?: string | null;
    best_time_to_visit?: string | null;
    insider_tips?: string | null;
    what_to_expect?: string | null;
  };
};
export default function ListingInfoContent({
  listing,
}: ListingInfoContentProps) {
  const highlights = parseHighlights(listing.highlights);
  const tips = parseTips(listing.insider_tips);
  const expectItems = parseExpectItems(listing.what_to_expect);
  const websiteHost = listing.website_url
    ? listing.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : undefined;
  return (
    <div className="space-y-14">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
          About
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-primary md:text-3xl">
          {listing.name}
        </h2>
        <div className="mt-6 space-y-5 text-foreground/80 leading-relaxed text-[17px]">
          <p
            className={
              "first-letter:font-display first-letter:text-5xl first-letter:font-semibold first-letter:text-primary first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]"
            }
            dangerouslySetInnerHTML={{ __html: listing.about ?? listing.description }} />
        </div>
      </div>
      {highlights.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Highlights
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-primary md:text-3xl">
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
      {expectItems.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            What to expect
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-primary md:text-3xl">
            The vibe, at a glance
          </h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {expectItems.map((item, i) => (
              <div
                key={i}
                className="rounded-3xl border border-border bg-card p-5"
              >
                <p className="font-display text-lg font-semibold">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Contact details, then where it is */}
      <div>
        <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Essentials
          </p>
          <h3 className="font-display text-2xl font-semibold mt-2">
            Visit & contact
          </h3>
          <ul className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
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
            {listing.fees && (
              <InfoRow icon={CreditCard} label="Fees">
                {listing.fees}
              </InfoRow>
            )}
            {listing.parking && (
              <InfoRow icon={ParkingCircle} label="Parking">
                {listing.parking}
              </InfoRow>
            )}
            {listing.best_time_to_visit && (
              <InfoRow icon={CalendarDays} label="Best time to visit">
                {listing.best_time_to_visit}
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
      </div>
      <LocationCard name={listing.name} address={listing.address || listing.location} />
      {tips.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Practical info
          </p>
          <h3 className="font-display text-2xl font-semibold mt-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" /> Insider tips
          </h3>
          <ul className="mt-6 space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-foreground/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span className="leading-relaxed text-[15px]">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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
      <span className="grid place-items-center h-9 w-9 rounded-full bg-cream text-primary shrink-0">
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