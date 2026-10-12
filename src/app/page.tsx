import type { Metadata } from "next";

import { Hero } from "@/components/home/Hero";
import { AboutUs } from "@/components/home/AboutUs";
import { EditorLetter } from "@/components/home/EditorLetter";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { MagazineStrip } from "@/components/home/MagazineStrip";
import { BlogPreview } from "@/components/home/BlogPreview";
import { PassportCTA } from "@/components/home/PassportCTA";

export const metadata: Metadata = {
  title: "The Marco Passport — Discover Marco Island, Florida",
  description:
    "Discover Marco Island through its best places to stay, eat, explore, shop, and experience. Plan your island days and find something worth remembering.",
  openGraph: {
    title: "The Marco Passport — Discover Marco Island, Florida",
    description:
      "Discover the places, flavors, and experiences that make Marco Island special.",
  },
};

// Featured listings come from the API at render time; refresh them every 10 minutes.
export const revalidate = 600;

export default function Home() {
  return (
    <>
      <Hero />
      <AboutUs />
      <EditorLetter />
      <FeaturedListings />
      <MagazineStrip />
      <BlogPreview />
      <PassportCTA />
    </>
  );
}
