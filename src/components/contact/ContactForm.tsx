"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...rest}
        className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary"
      />
    </div>
  );
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.error("Please fill out your name, email, and message.");
      return;
    }

    setSubmitting(true);
    try {
      // TODO: wire up to a real endpoint once one exists — for now this is
      // a static UI-only bypass so the flow can be tried end to end.
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast.success("Message sent", {
        description: "Thanks for reaching out — we'll get back to you soon.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-3xl border border-border shadow-soft p-8 space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          label="Email"
          placeholder="you@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Field
        label="Subject"
        placeholder="What's this about?"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <div>
        <label className="text-sm font-medium">Message</label>
        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary"
          placeholder="Tell us a little about it…"
        />
      </div>
      <Button type="submit" variant="gold" size="lg" disabled={submitting}>
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
