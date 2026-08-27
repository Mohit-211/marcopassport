import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlacesHero from "@/components/places/PlacesHero";
import TopPicksScroll from "@/components/places/TopPicksScroll";
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
      <section className="container mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-28">
        <div className="rounded-[2rem] bg-primary text-primary-foreground p-10 md:p-16 grid md:grid-cols-[1fr_auto] items-center gap-8 shadow-elegant relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              Your passport
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-2 text-balance max-w-2xl">
              Save these places and build your itinerary
            </h2>
            <p className="text-primary-foreground/80 mt-4 max-w-xl">
              Bookmark what catches your eye and we'll thread the timing,
              distances and reservations into a single shareable plan.
            </p>
          </div>
          <Link href="/passport" className="relative">
            <Button variant="gold" size="lg" className="text-base">
              Start your passport <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
