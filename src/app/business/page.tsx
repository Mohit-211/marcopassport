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

export const metadata: Metadata = {
  title: "Advertise With Us | The Marco Passport",
  description:
    "Reach locals and visitors across Marco Island. View our advertising rates and submit your business for the The Marco Passport Magazine.",
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
      <section className="relative isolate h-[78vh] overflow-hidden bg-primary text-primary-foreground">
        {/* Content */}
        <div className="mx-auto flex h-full max-w-7xl items-center px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-5 sm:text-[11px]">
              <span className="h-px w-8 bg-gold/70" />
              <Building2 className="h-3.5 w-3.5" />
              Business Directory
            </div>

            {/* Heading */}
            <h1 className="font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
              Advertise With{" "}
              <span className="italic text-gold">The Marco Passport</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
              Put your business in front of locals and visitors exploring Marco
              Island. Rates are published quarterly.
            </p>

            {/* CTA */}
            <div className="mt-7 sm:mt-8">
              <Link href="/business/submit">
                <Button variant="gold" size="lg">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Sheet — styled after the print rate card */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-14 sm:py-16 max-w-2xl">
          <div className="rounded-3xl border-2 border-[#EBBD00]/70 bg-[#0F2A3F] shadow-elegant overflow-hidden">
            {/* Card header */}
            <div className="px-6 sm:px-10 pt-10 pb-6 text-center border-b border-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#EBBD00] mb-2">
                The The Marco Passport
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Advertising Rate Sheet
              </h2>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-[#EBBD00]/50" />
                <span className="text-xs font-medium uppercase tracking-widest text-white/60">
                  Published Quarterly
                </span>
                <span className="h-px w-10 bg-[#EBBD00]/50" />
              </div>
            </div>

            {/* RATES badge */}
            <div className="flex justify-center -mt-4">
              <span className="rounded-full bg-[#EBBD00] px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0F2A3F] shadow-gold">
                Rates
              </span>
            </div>

            {/* Rate rows */}
            <div className="px-6 sm:px-10 pt-6 pb-8 space-y-3">
              {rates.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 rounded-2xl border border-[#EBBD00]/30 bg-white/[0.03] px-4 py-3.5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EBBD00] text-[#0F2A3F]">
                    <r.Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold uppercase tracking-wide text-white">
                    {r.name}
                  </span>
                  <span className="flex-1 border-b border-dotted border-white/25 mx-1 mt-3" />
                  <span className="text-xl sm:text-2xl font-semibold text-[#EBBD00]">
                    {r.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 px-10">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[#EBBD00] text-xs">✻</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            {/* Contact info */}
            <div className="px-6 sm:px-10 py-8">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-5">
                Contact Information
              </p>
              <ul className="space-y-4">
                {contact.map((c) => (
                  <li key={c.label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EBBD00] text-[#EBBD00]">
                      <c.Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-white/90">
                      <span className="font-semibold text-white">
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
            <Link href="/business/submit">
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
