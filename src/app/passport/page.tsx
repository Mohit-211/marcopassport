import type { Metadata } from "next";
import { PassportPage } from "@/components/passport/PassportPage";

export const metadata: Metadata = {
  title: "My Passport — Marco Passport",
  description:
    "Your personalized Marco Island itinerary. Save places, choose dates, and build the perfect trip.",
};

export default function Passport() {
  return <PassportPage />;
}
