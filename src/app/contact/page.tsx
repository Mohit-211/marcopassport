import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { HeroBackground } from "@/components/site/HeroBackground";

export const metadata: Metadata = {
  title: "Contact — The Marco Passport",
  description:
    "Get in touch with the The Marco Passport team — for press, partnerships and visitor questions.",
};

export default function ContactPage() {
  return (
    <>
      <section className="hero-viewport">
        <HeroBackground src="/assets/place-marina.jpg" alt="Marco Island marina at sunset" />
        <div className="hero-container">
          <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-5 sm:text-[11px]">
            <span className="h-px w-8 bg-gold/70" />
            Say hello
          </div>
          {/* Heading */}
          <h1 className="font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
            Let&apos;s talk Marco Island.
          </h1>
          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
            Questions, partnership ideas, or a story to share? We&apos;d love to
            hear from you.
          </p>
          </div>
        </div>
      </section>

      <section className="site-container py-16 grid md:grid-cols-[1.5fr_1fr] gap-10">
        <ContactForm />
        <ContactInfo />
      </section>
    </>
  );
}
