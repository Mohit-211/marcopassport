import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact — Marco Passport",
  description:
    "Get in touch with the Marco Passport team — for press, partnerships and visitor questions.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-sand border-b border-border">
        <div className="container mx-auto px-5 lg:px-8 py-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Say hello
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold mt-3 text-balance">
            Let&apos;s talk Marco Island.
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
            Questions, partnership ideas, or a story to share? We&apos;d love to
            hear from you.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-5 lg:px-8 py-16 grid md:grid-cols-[1.5fr_1fr] gap-10">
        <ContactForm />
        <ContactInfo />
      </section>
    </>
  );
}
