import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  FileText,
  Rows3,
  CreditCard,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Advertise With Us | The Marco Passport",
  description:
    "Reach locals and visitors across Marco Island. View our advertising rates and submit your business for The Marco Passport Magazine.",
};

const rates = [
  { id: "full_page", name: "Full Page", price: "$500", Icon: FileText },
  { id: "half_page", name: "1/2 Page", price: "$300", Icon: Rows3 },
  {
    id: "business_card",
    name: "Business Card",
    price: "$150",
    Icon: CreditCard,
  },
];

const contact = [
  {
    Icon: MapPin,
    label: "Address",
    value: "1001 N Barfield Dr, Marco Island, FL 34145",
  },
  { Icon: Phone, label: "Phone", value: "636-328-3133" },
  { Icon: Mail, label: "Email", value: "sales@themarcopassport.com" },
];

export default function BusinessPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        image="/assets/restaurant.jpg"
        imageAlt="Waterfront restaurant on Marco Island"
        icon={Building2}
        eyebrow="Business Directory"
        title={
          <>
            Advertise With{" "}
            <span className="italic text-gold">The Marco Passport</span>
          </>
        }
        description="Put your business in front of locals and visitors exploring Marco Island. Rates are published quarterly."
      >
        <Link href="/advertise-with-us/submit">
          <Button variant="gold" size="lg">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </PageHero>

      {/* Rate Sheet — styled after the print rate card */}
      <section className="bg-background">
        <div className="site-container py-14 sm:py-16 max-w-2xl">
          <div className="rounded-card border-2 border-gold/70 bg-primary shadow-elegant overflow-hidden">
            {/* Card header */}
            <div className="px-6 sm:px-10 pt-10 pb-6 text-center border-b border-primary-foreground/10">
              <p className="eyebrow text-gold mb-2">
                The Marco Passport
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-primary-foreground tracking-tight">
                Advertising Rate Sheet
              </h2>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-gold/50" />
                <span className="eyebrow text-primary-foreground/60">
                  Published Quarterly
                </span>
                <span className="h-px w-10 bg-gold/50" />
              </div>
            </div>

            {/* RATES badge */}
            <div className="flex justify-center -mt-4">
              <span className="eyebrow rounded-full bg-gold px-5 py-1.5 text-primary shadow-gold">
                Rates
              </span>
            </div>

            {/* Rate rows */}
            <div className="px-6 sm:px-10 pt-6 pb-8 space-y-3">
              {rates.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 rounded-tile border border-gold/30 bg-primary-foreground/5 px-4 py-3.5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tile bg-gold text-primary">
                    <r.Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold uppercase tracking-wide text-primary-foreground">
                    {r.name}
                  </span>
                  <span className="flex-1 border-b border-dotted border-primary-foreground/25 mx-1 mt-3" />
                  <span className="text-xl sm:text-2xl font-semibold text-gold">
                    {r.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 px-10">
              <span className="h-px flex-1 bg-primary-foreground/10" />
              <span className="text-gold text-xs">✻</span>
              <span className="h-px flex-1 bg-primary-foreground/10" />
            </div>

            {/* Contact info */}
            <div className="px-6 sm:px-10 py-8">
              <p className="eyebrow text-center text-primary-foreground/70 mb-5">
                Contact Information
              </p>
              <ul className="space-y-4">
                {contact.map((c) => (
                  <li key={c.label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold text-gold">
                      <c.Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-primary-foreground/90">
                      <span className="font-semibold text-primary-foreground">
                        {c.label}:
                      </span>{" "}
                      {c.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/advertise-with-us/submit">
              <Button variant="gold" size="lg">
                Submit Your Business
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
