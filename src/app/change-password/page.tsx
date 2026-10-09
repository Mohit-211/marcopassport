import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Change password — The Marco Passport",
  description: "Update the password for your The Marco Passport account.",
};

export default function ChangePasswordPage() {
  return <ChangePasswordForm />;
}
