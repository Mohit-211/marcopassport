import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmail } from "@/components/auth/VerifyEmail";
import { AuthCardSkeleton, AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Verify email — The Marco Passport",
  description: "Confirm the email address for your The Marco Passport account.",
  robots: { index: false },
};

// The backend emails links to exactly this path: <FRONTEND_URL>/verify-email?token=…
export default function VerifyEmailPage() {
  return (
    <AuthShell>
      {/* Shell paints immediately; only the card waits for the URL params. */}
      <Suspense fallback={<AuthCardSkeleton />}>
        <VerifyEmail />
      </Suspense>
    </AuthShell>
  );
}
