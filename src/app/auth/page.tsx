import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign in — The Marco Passport",
  description:
    "Sign in or create your The Marco Passport account to save places and plan your visits.",
};

export default function AuthPage() {
  return <AuthForm />;
}
