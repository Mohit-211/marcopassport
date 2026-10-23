"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SubscribeNewsletterApi, type NewsletterSource } from "@/api/users/newsletter.api";

/**
 * State for a newsletter form (footer or blog): the email typed, and whether
 * it's sending or done. Emails are only saved for now; no mailing service yet.
 */
export function useNewsletterSignup(source: NewsletterSource) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      toast.error("Please enter your email address.");
      return;
    }
    setStatus("sending");
    try {
      await SubscribeNewsletterApi({ email: value, source });
      setStatus("done");
    } catch {
      // The error popup is shown by the global API error handler.
      setStatus("idle");
    }
  };

  return { email, setEmail, status, submit };
}
