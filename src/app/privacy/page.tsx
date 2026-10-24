import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CookieSettingsButton } from "@/components/site/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What The Marco Passport collects when you use the site, why, and the choices you have, including cookies.",
};

const CONTACT_EMAIL = "sales@themarcopassport.com";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        size="compact"
        image="/assets/hero-marco-island.jpg"
        imageAlt=""
        icon={ShieldCheck}
        eyebrow="Privacy"
        title="Privacy policy"
        description="What we collect when you use The Marco Passport, why, and the choices you have. Last updated October 24, 2026."
      />

      <section className="site-container py-14 md:py-20">
        <div className="blog-content max-w-3xl">
          <h2>Who we are</h2>
          <p>
            The Marco Passport is a guide to Marco Island, Florida. You can reach
            us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, by phone
            at <a href="tel:+16363283133">636-328-3133</a>, by post at 1001 N
            Barfield Dr, Marco Island, FL 34145, or through our{" "}
            <Link href="/contact">contact form</Link>.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Your account.</strong> Your name, email address and
              password when you sign up. We store the password only in hashed
              form.
            </li>
            <li>
              <strong>Sign-in records.</strong> When you sign in or out, the
              time, your time zone and your IP address, to keep accounts secure.
            </li>
            <li>
              <strong>What you add.</strong> The passports you save (names,
              dates and places) and the reviews you post. Reviews are public and
              show your name.
            </li>
            <li>
              <strong>Messages you send us.</strong> What you enter in the
              contact form (name, email, subject and message), in the business
              submission form (business and contact name, email, phone, website,
              plan and details) and when you sign up for the newsletter (your
              email address).
            </li>
            <li>
              <strong>Technical logs.</strong> Our server keeps standard logs of
              requests and errors so we can run and fix the site.
            </li>
          </ul>
          <p>We don&apos;t collect payment details on this site.</p>

          <h2>How we use it</h2>
          <ul>
            <li>To run your account: signing you in, saving your passports and publishing your reviews.</li>
            <li>To send account emails, such as email verification and password reset links.</li>
            <li>To answer your messages and business submissions.</li>
            <li>To send the newsletter once it starts. Every newsletter will include a way to unsubscribe.</li>
            <li>To keep the site secure and working.</li>
          </ul>
          <p>We don&apos;t sell your personal information or use it for advertising.</p>

          <h2 id="cookies" className="scroll-mt-(--header-offset)">
            Cookies and storage on your device
          </h2>
          <p>
            We don&apos;t use advertising or analytics cookies. The site keeps
            only what it needs to work, in your browser&apos;s storage:
          </p>
          <ul>
            <li>
              <strong>Sign-in token</strong> (<code>MarcoPassport</code>): keeps
              you signed in.
            </li>
            <li>
              <strong>Saved places</strong> (<code>mp_passport_draft</code>):
              remembers the places you add before signing in, so they can be
              saved to your account when you do.
            </li>
            <li>
              <strong>Planner layout</strong> (<code>planner-panel-width</code>):
              remembers the panel width you set in the trip planner.
            </li>
            <li>
              <strong>Your cookie choice</strong> (<code>mp_cookie_consent</code>):
              remembers your answer, so we don&apos;t ask again.
            </li>
          </ul>
          <p>
            If you accept, these stay on your device until you sign out or clear
            your browser data. If you reject, the sign-in token, saved places and
            planner layout are kept only until you close the tab; only your
            choice itself is remembered.
          </p>
          <p>
            Maps on place and business pages, and in your passports, are
            embedded from Google Maps. Google may set its own cookies when a map
            loads; see{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google&apos;s privacy policy
            </a>
            .
          </p>
          <CookieSettingsButton />

          <h2>Who we share it with</h2>
          <p>
            Only the services that help us run the site, such as our hosting
            provider and the email service that sends account emails, and only
            as far as they need it to do that work. We may also disclose
            information if the law requires it.
          </p>

          <h2>How long we keep it</h2>
          <ul>
            <li>Accounts that are never verified are deleted automatically after 24 hours.</li>
            <li>
              Your account, passports and reviews are kept until you delete
              them or ask us to. You can delete your passports and reviews
              yourself at any time.
            </li>
            <li>Messages and business submissions are kept as long as we need them to respond and keep business records.</li>
            <li>Newsletter sign-ups are kept until you unsubscribe or ask us to remove you.</li>
          </ul>

          <h2>Your choices</h2>
          <p>
            You can ask us for a copy of your personal information, ask us to
            correct it, or ask us to delete it, including your account, by
            emailing <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You
            can change your cookie choice at any time with the button above.
          </p>

          <h2>Children</h2>
          <p>
            The site isn&apos;t aimed at children under 13, and we don&apos;t
            knowingly collect their information.
          </p>

          <h2>Changes to this policy</h2>
          <p>If we change this policy, we&apos;ll update this page and the date at the top.</p>
        </div>
      </section>
    </>
  );
}
