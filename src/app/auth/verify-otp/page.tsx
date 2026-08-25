import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

export const metadata: Metadata = {
  title: "Verify code — The Marco Passport",
  description: "Enter the one-time code sent to your email.",
};

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
