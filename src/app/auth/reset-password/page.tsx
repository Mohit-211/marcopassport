import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AuthCardSkeleton, AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Reset password — The Marco Passport",
  description: "Choose a new password for your The Marco Passport account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      {/* Shell paints immediately; only the card waits for the URL params. */}
      <Suspense fallback={<AuthCardSkeleton />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
