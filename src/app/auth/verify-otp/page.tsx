import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";
import { AuthCardSkeleton, AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Verify code — The Marco Passport",
  description: "Enter the one-time code sent to your email.",
};

export default function VerifyOtpPage() {
  return (
    <AuthShell>
      {/* Shell paints immediately; only the card waits for the URL params. */}
      <Suspense fallback={<AuthCardSkeleton />}>
        <VerifyOtpForm />
      </Suspense>
    </AuthShell>
  );
}
