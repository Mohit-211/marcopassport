"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SendContactMessageApi } from "@/api/users/contact.api";

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <input
        id={id}
        {...rest}
        className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary"
      />
    </div>
  );
}

export function ContactForm() {
  const messageId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill out your name, email, and message.");
      return;
    }

    setSubmitting(true);
    try {
      await SendContactMessageApi({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || undefined,
        message: message.trim(),
      });
      toast.success("Message sent", {
        description: "Thanks for reaching out — we'll get back to you soon.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      // The error popup is shown by the global API error handler.
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
          autoComplete="name"
          maxLength={150}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          label="Email"
          placeholder="you@email.com"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Field
        label="Subject"
        placeholder="What's this about?"
        maxLength={200}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <div>
        <label htmlFor={messageId} className="text-sm font-medium">Message</label>
        <textarea
          id={messageId}
          rows={6}
          maxLength={5000}
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
