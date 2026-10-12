"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthForm } from "@/components/auth/AuthForm";
import { useItineraries } from "@/features/itineraries/ItinerariesProvider";
import { getSafeRedirect } from "@/lib/auth";

/** The /auth page form: after login, save any guest draft, then move on. */
export function AuthPageForm() {
  const router = useRouter();
  const { completeLogin } = useItineraries();

  return (
    <AuthForm
      onLoggedIn={async () => {
        toast.success("Welcome back");
        const saved = await completeLogin();
        // Read at navigation time rather than via useSearchParams, which would
        // force the whole form to client-render behind a Suspense boundary.
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        router.push(saved ? `/passport/${saved.id}` : getSafeRedirect(redirect));
      }}
    />
  );
}
