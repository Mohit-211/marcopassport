import type { Metadata } from "next";
import { PassportPage } from "@/features/itineraries/components/PassportPage";

export const metadata: Metadata = {
  title: "My Passport — The Marco Passport",
  description:
    "Plan your Marco Island itinerary: add places, put them in visiting order, pick dates and see the route on a map.",
};

export default function Passport() {
  return <PassportPage />;
}
