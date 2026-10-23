import type { Metadata } from "next";
import Link from "next/link";
import { ScrollText } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The rules for using The Marco Passport: accounts, reviews, listings, advertising and the limits of what we can promise.",
};

const CONTACT_EMAIL = "sales@themarcopassport.com";

export default function TermsPage() {
  return (
    <>
      <PageHero
        size="compact"
        image="/assets/hero-marco-island.jpg"
        imageAlt=""
        icon={ScrollText}
        eyebrow="Terms"
        title="Terms of use"
        description="The rules for using The Marco Passport. Last updated October 24, 2026."
      />

      <section className="site-container py-14 md:py-20">
        <div className="blog-content max-w-3xl">
          <h2>Using the site</h2>
          <p>
            The Marco Passport is a guide to Marco Island, Florida. By using
            themarcopassport.com you agree to these terms. If you don&apos;t
            agree, please don&apos;t use the site. How we handle personal
            information is covered in our <Link href="/privacy">privacy policy</Link>.
          </p>

          <h2>Your account</h2>
          <p>
            You need an account to save itineraries and post reviews, and you
            must be at least 13 to create one. Keep your password to yourself:
            you&apos;re responsible for what happens under your account. We may
            suspend or remove accounts that break these terms.
          </p>

          <h2>Reviews</h2>
          <p>
            Reviews must describe your own experience. Don&apos;t post anything
            unlawful, abusive, misleading or promotional, or anything you
            don&apos;t have the right to share. You keep ownership of your
            reviews and let us show them on the site, with your name. We may
            remove reviews that break these rules.
          </p>

          <h2>Listings and information</h2>
          <p>
            We work to keep listings, hours, prices and other details accurate,
            but they can change without notice. Check with the business before
            you go.
          </p>

          <h2>Advertising and business submissions</h2>
          <p>
            Submitting your business through{" "}
            <Link href="/advertise-with-us">Advertise With Us</Link> is a
            request, not a confirmed booking. We&apos;ll contact you to confirm
            the details before anything is published.
          </p>

          <h2>Other websites</h2>
          <p>
            The site links to other websites, such as businesses&apos; own sites
            and Google Maps. We&apos;re not responsible for their content or how
            they handle your information.
          </p>

          <h2>Our content</h2>
          <p>
            The site&apos;s text, photos, logo and design belong to The Marco
            Passport or to those who license them to us. Please don&apos;t copy
            or reuse them without permission; sharing links is always welcome.
          </p>

          <h2>No guarantees</h2>
          <p>
            The site is provided as it is. We do our best to keep it accurate
            and available, but we can&apos;t promise it will always be
            error-free or online. To the extent the law allows, we aren&apos;t
            liable for any loss that comes from using the site or relying on
            its information.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these terms. When we do, we&apos;ll change the date
            at the top; using the site after that means you accept the new
            terms.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of the State of Florida.</p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use our{" "}
            <Link href="/contact">contact form</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
