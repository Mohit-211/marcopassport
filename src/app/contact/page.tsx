import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Contact — The Marco Passport",
  description:
    "Get in touch with The Marco Passport team — for press, partnerships and visitor questions.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        image="/assets/place-marina.jpg"
        imageAlt="Marco Island marina at sunset"
        eyebrow="Say hello"
        title="Let's talk Marco Island."
        description="Questions, partnership ideas, or a tip to share? We'd love to hear from you."
      />

      <section className="site-container py-16 grid md:grid-cols-[1.5fr_1fr] gap-10">
        <ContactForm />
        <ContactInfo />
      </section>
    </>
  );
}
