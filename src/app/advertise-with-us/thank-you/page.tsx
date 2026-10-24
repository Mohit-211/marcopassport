import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Thank You | The Marco Passport",
  description:
    "Thank you for submitting your business to The Marco Passport Magazine.",
};

export default function BusinessThankYouPage() {
  return (
    <PageHero
      size="compact"
      image="/assets/restaurant.jpg"
      icon={CheckCircle2}
      eyebrow="Advertise with us"
      title="Thank you!"
      description="We've received your submission. Our team will review it and get back to you within 24 hours."
    >
      <div className="flex flex-wrap gap-3">
        <Button variant="gold" size="lg" nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
        <Button variant="ghostLight" size="lg" nativeButton={false} render={<Link href="/advertise-with-us" />}>
          Back to advertising
        </Button>
      </div>
    </PageHero>
  );
}
