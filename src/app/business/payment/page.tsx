"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  CreditCard,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PaymentPage() {
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // TODO: wire up real payment processing once backend is available
    setTimeout(() => {
      router.push("/business/thank-you");
    }, 1600);
  };

  return (
    <>
      <section className="bg-gradient-to-b from-[#002E50]/5 to-transparent border-b border-border">
        <div className="container mx-auto px-4 py-10 sm:py-14 max-w-3xl">
          <Link
            href="/business/package"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#002E50] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Package
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBBD00]/15 px-3 py-1 text-xs font-semibold text-[#002E50]">
              <Lock className="h-3.5 w-3.5" />
              Secure Checkout
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#002E50] tracking-tight">
            Complete Your Payment
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Your payment is encrypted and secure. This only takes a moment.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container mx-auto px-4 py-10 sm:py-14 max-w-3xl space-y-6">
          {/* Summary */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#002E50]">
                Order Summary
              </h2>
              <Link
                href="/business/package"
                className="text-xs font-medium text-[#002E50] hover:text-[#EBBD00] transition-colors"
              >
                Change
              </Link>
            </div>
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002E50] text-[#EBBD00] shrink-0">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#002E50]">
                    Featured Listing
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Priority placement, featured badge, and gallery.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-[#002E50]">$29.00</p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>$29.00</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border text-base font-semibold text-[#002E50]">
                <span>Total due today</span>
                <span>$29.00</span>
              </div>
            </div>
          </div>

          {/* Payment form */}
          <form
            onSubmit={handlePay}
            className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm space-y-5"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#002E50]" />
              <h2 className="text-lg font-semibold text-[#002E50]">
                Payment Details
              </h2>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#002E50]">
                Cardholder Name
              </Label>
              <Input
                placeholder="Name on card"
                required
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#002E50]">
                Card Number
              </Label>
              <div className="relative">
                <Input
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  required
                  className="rounded-xl h-11 pr-12"
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#002E50]">
                  Expiry
                </Label>
                <Input
                  placeholder="MM / YY"
                  required
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#002E50]">
                  CVC
                </Label>
                <Input
                  placeholder="123"
                  inputMode="numeric"
                  required
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#002E50]">
                Billing Email
              </Label>
              <Input
                type="email"
                placeholder="you@example.com"
                required
                className="rounded-xl h-11"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={processing}
              className="w-full"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing payment…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Pay $29.00 Now
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#EBBD00]" />
              Secured with 256-bit SSL encryption
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
