import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank You | The Marco Passport",
  description:
    "Thank you for submitting your business to The Marco Passport Magazine.",
};

export default function BusinessThankYouPage() {
  return (
    <section className="bg-[#18384E] min-h-[70vh] flex items-center">
      <div className="container mx-auto px-4 py-20 max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBBD00] text-[#18384E] mb-6">
          <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
          Thank You!
        </h1>
        <p className="mt-4 text-white/80 text-base sm:text-lg">
          We&apos;ve received your submission. Our team will review it and get
          back to you within 24 hours.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="gold" size="lg">
              Back to Home
            </Button>
          </Link>
          <Link
            href="/business"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Back to Advertising
          </Link>
        </div>
      </div>
    </section>
  );
}
