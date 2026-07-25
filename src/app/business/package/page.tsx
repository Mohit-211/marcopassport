"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Star,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PackageId = "basic" | "featured" | "banner";

const packages: {
  id: PackageId;
  name: string;
  tagline: string;
  price: string;
  period: string;
  Icon: typeof Check;
  features: string[];
  recommended?: boolean;
}[] = [
  {
    id: "basic",
    name: "Basic Listing",
    tagline: "A clean, searchable profile to get discovered.",
    price: "Free",
    period: "forever",
    Icon: Check,
    features: [
      "Standard directory visibility",
      "Contact info & website link",
      "Single category placement",
      "Basic profile photo",
    ],
  },
  {
    id: "featured",
    name: "Featured Listing",
    tagline: "Higher placement and a highlighted profile.",
    price: "$29",
    period: "per month",
    Icon: Star,
    features: [
      "Priority placement in category",
      "Featured badge & highlight",
      "Photo gallery (up to 12)",
      "Appears in curated guides",
    ],
    recommended: true,
  },
  {
    id: "banner",
    name: "Banner Promotion",
    tagline: "Premium homepage exposure for maximum reach.",
    price: "$79",
    period: "per month",
    Icon: Megaphone,
    features: [
      "Homepage banner exposure",
      "Top of category placement",
      "Featured listing perks included",
      "Monthly performance report",
    ],
  },
];

export default function PackagePage() {
  const [selected, setSelected] = useState<PackageId | null>("featured");
  const router = useRouter();

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-[#002E50]/5 to-transparent border-b border-border">
        <div className="container mx-auto px-4 py-10 sm:py-14 max-w-5xl">
          <Link
            href="/business/submit"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#002E50] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Submission
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBBD00]/15 px-3 py-1 text-xs font-semibold text-[#002E50]">
              <Sparkles className="h-3.5 w-3.5" />
              Step 2 of 2 — Choose Package
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#002E50] tracking-tight">
            Choose Your Listing Package
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg max-w-2xl">
            Select the option that best fits your visibility needs. You can
            upgrade or change your plan at any time.
          </p>

          {/* Progress */}
          <div className="mt-8 flex items-center gap-3 max-w-md">
            <div className="flex-1 h-1.5 rounded-full bg-[#002E50]/10 overflow-hidden">
              <div className="h-full w-full bg-[#EBBD00] rounded-full" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              100%
            </span>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-10 sm:py-14 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 md:items-stretch">
            {packages.map((p) => {
              const isSelected = selected === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  className={cn(
                    "group relative text-left rounded-2xl border-2 bg-card p-6 sm:p-7 transition-all flex flex-col",
                    isSelected
                      ? "border-[#EBBD00] shadow-xl md:-translate-y-1"
                      : "border-border hover:border-[#002E50]/30 hover:shadow-md",
                    p.recommended &&
                      !isSelected &&
                      "md:-translate-y-1 shadow-md"
                  )}
                >
                  {p.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#EBBD00] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#002E50] shadow">
                      <Star className="h-3 w-3 fill-[#002E50]" />
                      Recommended
                    </span>
                  )}

                  {isSelected && (
                    <span className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#EBBD00] text-[#002E50]">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}

                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl mb-4 transition-colors",
                      isSelected
                        ? "bg-[#002E50] text-[#EBBD00]"
                        : "bg-[#002E50]/5 text-[#002E50] group-hover:bg-[#002E50]/10"
                    )}
                  >
                    <p.Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-xl font-semibold text-[#002E50]">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 min-h-[40px]">
                    {p.tagline}
                  </p>

                  <div className="mt-5 pb-5 border-b border-border">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-semibold text-[#002E50]">
                        {p.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {p.period}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5 flex-1">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-[#002E50]/80"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                            isSelected
                              ? "bg-[#EBBD00] text-[#002E50]"
                              : "bg-[#002E50]/10 text-[#002E50]"
                          )}
                        >
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={cn(
                      "mt-6 text-center text-xs font-semibold uppercase tracking-wider transition-colors",
                      isSelected ? "text-[#002E50]" : "text-muted-foreground"
                    )}
                  >
                    {isSelected ? "Selected" : "Click to select"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reassurance */}
          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 sm:p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#002E50] text-[#EBBD00]">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-[#002E50]">
                Next: secure payment & review.
              </span>{" "}
              Your listing goes live after our editorial team reviews it —
              usually within 24 hours. Cancel or change plans anytime.
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-4 z-10 mt-8">
            <div className="rounded-2xl border border-border bg-card/95 backdrop-blur p-4 sm:p-5 shadow-lg flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
              <Link
                href="/business/submit"
                className="text-sm font-medium text-[#002E50] hover:underline text-center sm:text-left"
              >
                ← Back to Submission
              </Link>
              <Button
                type="button"
                variant="gold"
                size="lg"
                disabled={!selected}
                onClick={() => router.push("/business/payment")}
                className="group w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
