import type { Metadata } from "next";
import { MyTripsList } from "@/features/trips/components/MyTripsList";

export const metadata: Metadata = {
  title: "My Trips — The Marco Passport",
  description: "Your saved Marco Island trips.",
  robots: { index: false },
};

export default function MyTripsPage() {
  return <MyTripsList />;
}
