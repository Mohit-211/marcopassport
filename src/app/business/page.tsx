import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Eye,
  FileText,
  Globe,
  CreditCard,
  BadgeCheck,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "List Your Business — Marco Passport",
  description:
    "Reach travelers and locals on Marco Island. List your business on Marco Passport and grow your visibility.",
};

const steps = [
  {
    step: "01",
    icon: FileText,
    title: "Submit your details",
    text: "Share basic info about your business — name, category, and a short description.",
  },
  {
    step: "02",
    icon: CreditCard,
    title: "Choose a package",
    text: "Pick a listing option that fits your goals, from Basic to Featured and Banner.",
  },
  {
    step: "03",
    icon: BadgeCheck,
    title: "Get listed",
    text: "We review and publish your listing so travelers and locals can discover you.",
  },
];

const benefits = [
  {
    Icon: Eye,
    title: "Visibility",
    text: "Be seen by tourists actively planning their Marco Island visit.",
  },
  {
    Icon: Globe,
    title: "Exposure",
    text: "Your listing reaches both visitors and year-round locals.",
  },
  {
    Icon: TrendingUp,
    title: "Direct bookings",
    text: "Drive reservations, calls, and website visits from interested guests.",
  },
  {
    Icon: MapPin,
    title: "Local trust",
    text: "Appear in a curated, editorial-quality directory that people trust.",
  },
];

const packages = [
  {
    name: "Basic Listing",
    desc: "A clean, searchable profile with your contact info and website link.",
  },
  {
    name: "Featured Listing",
    desc: "Stand out with a badge, editorial copy polish, and homepage rotation.",
  },
  {
    name: "Banner Promotion",
    desc: "Maximum exposure with hero placement, category sponsorship, and magazine spot.",
  },
];

export default function BusinessPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-sand">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container relative mx-auto px-5 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              For Businesses
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold mt-3 text-balance text-primary">
              List Your Business on Marco Passport
            </h1>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              Marco Passport helps businesses gain visibility among tourists and
              locals visiting Marco Island. Join a curated directory designed to
              connect the right people with the right places.
            </p>
            <div className="mt-8">
              <Link href="/business/submit">
                <Button variant="gold" size="lg" className="group">
                  Continue to Submit Your Business
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-5 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            How it works
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-3 text-balance text-primary">
            Three simple steps to get listed
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="relative text-center">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-display text-6xl font-bold text-primary/[0.06] select-none">
                {s.step}
              </span>
              <div className="relative">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sand text-primary border border-border">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold mt-5 text-primary">
                  {s.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-xs mx-auto">
                  {s.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits + visual */}
      <section className="bg-sand border-y border-border">
        <div className="container mx-auto px-5 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                Why list
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mt-3 text-balance text-primary">
                What you gain
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Marco Passport is more than a directory. It's a trusted
                companion for visitors — and a direct line to your next
                customer.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-5">
                {benefits.map((b) => (
                  <div key={b.title} className="flex gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-gold shrink-0">
                      <b.Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="font-display font-semibold text-primary">
                        {b.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {b.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-elegant border border-border">
                <img
                  src="/assets/listing-restaurant.jpg"
                  alt="Marco Island restaurant"
                  className="w-full h-80 md:h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl p-4 shadow-soft hidden md:flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-gold-foreground">
                  <Building2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Trusted by</p>
                  <p className="font-display font-semibold text-primary text-sm">
                    Local businesses on Marco Island
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listing Options */}
      <section className="container mx-auto px-5 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Listing Options
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-3 text-balance text-primary">
            Choose what fits your goals
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((p, i) => (
            <div
              key={p.name}
              className={cn(
                "bg-card rounded-2xl border p-6 md:p-8 transition-all hover:shadow-elegant",
                i === 1
                  ? "border-gold/60 shadow-soft"
                  : "border-border shadow-soft"
              )}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-sand text-primary border border-border">
                {i === 0 ? (
                  <FileText className="h-5 w-5" />
                ) : i === 1 ? (
                  <BadgeCheck className="h-5 w-5" />
                ) : (
                  <TrendingUp className="h-5 w-5" />
                )}
              </div>
              <h3 className="font-display text-lg font-semibold mt-4 text-primary">
                {p.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="submit" className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-5 lg:px-8 py-20 md:py-24 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-balance">
            Ready to reach more guests?
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto text-lg">
            Join Marco Passport today and start connecting with travelers who
            are already looking for what you offer.
          </p>
          <div className="mt-8">
            <Link href="/contact">
              <Button variant="gold" size="lg" className="group">
                Continue to Submit Your Business
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/60">
            We'll review your submission within 48 hours.
          </p>
        </div>
      </section>
    </>
  );
}
