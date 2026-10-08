import type { Metadata } from "next";
import { CtaSection } from "@/components/site/CtaSection";
import PlacesHero from "@/components/places/PlacesHero";
import PlacesGrid from "@/components/places/PlacesGrid";
import EditorialGuide from "@/components/places/EditorialGuide";
import { GetAllPlacesApi } from "@/api/users/places.api";
import { mapPlaceToCard, type PlaceCard } from "@/lib/place";
import type { ApiPlacesListResponse } from "@/types/place";

export const metadata: Metadata = {
  title: "Places to Visit — The Marco Passport",
  description:
    "Explore Marco Island's most beautiful beaches, landmarks, hidden coves, and scenic spots, from familiar favorites to places worth discovering.",
  openGraph: {
    title: "Places to Visit — The Marco Passport",
    description:
      "Discover the beaches, landmarks, hidden coves, and scenic spots that make Marco Island special.",
    images: ["/assets/places-hero.jpg"],
  },
};

async function getPlaces(): Promise<{ places: PlaceCard[]; total: number }> {
  try {
    const res = await GetAllPlacesApi();
    const payload: ApiPlacesListResponse = res?.data?.data ?? {};
    const items = payload.places ?? [];
    return {
      places: items.map(mapPlaceToCard),
      total: payload.total ?? items.length,
    };
  } catch (error) {
    console.error("Failed to fetch places:", error);
    return { places: [], total: 0 };
  }
}

export default async function PlacesPage() {
  const { places, total } = await getPlaces();

  return (
    <>
      <PlacesHero total={total} />
      {/* <TopPicksScroll places={places} /> */}
      <PlacesGrid places={places} />
      <EditorialGuide />

      {/* CTA */}
      <CtaSection
        eyebrow="Your passport"
        title="Save these places and build your itinerary"
        description="Bookmark what catches your eye and we'll thread the timing, distances and reservations into a single shareable plan."
        actions={[{ label: "Start your passport", href: "/passport" }]}
      />
    </>
  );
}
