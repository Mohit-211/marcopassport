import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Mail, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank You — Marco Passport",
  description:
    "Your Marco Passport listing submission has been received successfully.",
};

export default function ThankYouPage() {
  return (
    <section className="bg-gradient-to-b from-[#002E50]/5 via-[#EBBD00]/5 to-transparent">
      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-2xl text-center">
        {/* Success icon */}
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#EBBD00]/20 animate-ping" />
          <span className="absolute inset-2 rounded-full bg-[#EBBD00]/30" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#EBBD00] text-[#002E50] shadow-lg">
            <Check className="h-10 w-10" strokeWidth={3} />
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#002E50] tracking-tight">
          Thank You! Your Submission is Received
        </h1>
        <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
          Your business details and payment have been successfully submitted.
          Our editorial team will review your listing shortly.
        </p>

        {/* What's next */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm text-left">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#002E50] mb-5 text-center">
            What happens next
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#002E50]/5 text-[#002E50]">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#002E50]">
                  Confirmation email
                </p>
                <p className="text-sm text-muted-foreground">
                  A receipt and submission summary are on the way to your inbox.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#002E50]/5 text-[#002E50]">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#002E50]">
                  Editorial review
                </p>
                <p className="text-sm text-muted-foreground">
                  Our team reviews submissions within 24 hours on business days.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#002E50]/5 text-[#002E50]">
                <Eye className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#002E50]">Goes live</p>
                <p className="text-sm text-muted-foreground">
                  Once approved, your listing appears across Marco Passport.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/listings">
            <Button variant="gold" size="lg" className="group w-full sm:w-auto">
              Explore Listings
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-[#002E50]/20 text-[#002E50] hover:bg-[#002E50]/5"
            >
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Need help?{" "}
          <Link
            href="/contact"
            className="font-medium text-[#002E50] hover:text-[#EBBD00] transition-colors underline underline-offset-4"
          >
            Contact support
          </Link>
        </p>
      </div>
    </section>
  );
}
