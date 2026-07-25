import type { Metadata } from "next";

import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { TopPlaces } from "@/components/home/TopPlaces";
import { MagazineStrip } from "@/components/home/MagazineStrip";
import { BlogPreview } from "@/components/home/BlogPreview";
import { PassportCTA } from "@/components/home/PassportCTA";

export const metadata: Metadata = {
  title: "Marco Passport — Discover Marco Island, Florida",
  description:
    "A curated digital passport to Marco Island. Explore the best places to stay, eat, play and shop, and plan your perfect island itinerary.",
  openGraph: {
    title: "Marco Passport — Discover Marco Island, Florida",
    description:
      "A curated digital passport to Marco Island. Explore the best places to stay, eat, play and shop.",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedListings />
      <TopPlaces />
      <MagazineStrip />
      <BlogPreview />
      <PassportCTA />
    </>
  );
}
