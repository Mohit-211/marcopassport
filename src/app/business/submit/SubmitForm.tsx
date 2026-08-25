"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Rows3,
  CreditCard,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CreateBusinesssApi } from "@/api/users/business.api";

type PlanId = "full_page" | "half_page" | "business_card";

const plans: {
  id: PlanId;
  name: string;
  price: string;
  Icon: typeof Check;
}[] = [
  { id: "full_page", name: "Full Page", price: "$500", Icon: FileText },
  { id: "half_page", name: "1/2 Page", price: "$300", Icon: Rows3 },
  {
    id: "business_card",
    name: "Business Card",
    price: "$150",
    Icon: CreditCard,
  },
];

export default function SubmitForm() {
  const router = useRouter();

  const [plan, setPlan] = useState<PlanId | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!businessName || !contactName || !email || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!plan) {
      toast.error("Please choose an advertising plan.");
      return;
    }

    setSubmitting(true);
    try {
      await CreateBusinesssApi({
        business_name: businessName,
        contact_name: contactName,
        email,
        phone,
        website: website || undefined,
        plan,
        message: message || undefined,
      });
      toast.success("Your submission has been received!");
      router.push("/business/thank-you");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Header */}
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="container mx-auto px-5 lg:px-8 pt-28 pb-14 md:pt-36 md:pb-16 max-w-2xl">
          <Link
            href="/business"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary-foreground/80 hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Advertising
          </Link>
          <h1 className="mt-6 font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
            Submit Your <span className="italic text-gold">Business</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-primary-foreground/80 max-w-xl">
            Fill out the form below and choose the plan that fits your business.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-12 sm:py-14 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Details */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourbusiness.com"
                />
              </div>
            </div>

            {/* Plan Selection */}
            <div className="space-y-3">
              <Label>Choose Your Plan *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {plans.map((p) => {
                  const isSelected = plan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlan(p.id)}
                      className={cn(
                        "relative text-left rounded-2xl border-2 bg-card p-4 transition-all",
                        isSelected
                          ? "border-[#EBBD00] shadow-md"
                          : "border-border hover:border-[#002E50]/30"
                      )}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#EBBD00] text-[#002E50]">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                      )}
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg mb-3",
                          isSelected
                            ? "bg-[#002E50] text-[#EBBD00]"
                            : "bg-[#002E50]/5 text-[#002E50]"
                        )}
                      >
                        <p.Icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-[#002E50]">
                        {p.name}
                      </p>
                      <p className="text-lg font-semibold text-[#002E50] mt-0.5">
                        {p.price}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-1.5">
              <Label htmlFor="message">Additional Details (optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us anything else about your business or ad request"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
