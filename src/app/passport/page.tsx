import type { Metadata } from "next";
import { PassportPage } from "@/features/passport/components/PassportPage";

export const metadata: Metadata = {
  title: "My Passport — The Marco Passport",
  description:
    "Plan your Marco Island passport: add places, put them in visiting order, pick dates and see the route on a map.",
};

export default function Passport() {
  return <PassportPage />;
}
