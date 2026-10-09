import type { Metadata } from "next";
import { TripDetail } from "@/features/trips/components/TripDetail";

export const metadata: Metadata = {
  title: "Trip — The Marco Passport",
  robots: { index: false },
};

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TripDetail tripId={id} />;
}
