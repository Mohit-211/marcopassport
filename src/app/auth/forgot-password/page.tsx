import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthCardSkeleton, AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Forgot password — The Marco Passport",
  description:
    "Request a one-time code to reset your The Marco Passport account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      {/* Shell paints immediately; only the card waits for the URL params. */}
      <Suspense fallback={<AuthCardSkeleton />}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
