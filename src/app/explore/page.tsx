import type { Metadata } from "next";
import { ExplorePage } from "@/components/explore/ExplorePage";

export const metadata: Metadata = {
  title: "Explore the Directory — Marco Passport",
  description:
    "Browse, filter and discover every hand-vetted business on Marco Island — resorts, restaurants, activities, shopping and local services.",
  openGraph: {
    title: "Explore the Directory — Marco Passport",
    description:
      "A curated marketplace of Marco Island's best — filter by category, price and neighborhood.",
  },
};

export default function Explore() {
  return <ExplorePage />;
}
