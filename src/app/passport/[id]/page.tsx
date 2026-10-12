import type { Metadata } from "next";
import { ItineraryPage } from "@/features/itineraries/components/ItineraryPage";

export const metadata: Metadata = {
  title: "Itinerary — The Marco Passport",
  robots: { index: false },
};

export default async function Itinerary({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ItineraryPage id={id} />;
}
