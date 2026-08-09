import type { Metadata } from "next";
import { ExplorePage } from "@/components/explore/ExplorePage";

export const metadata: Metadata = {
  title: "Explore the Directory — The Marco Passport",
  description:
    "Discover places to stay, eat, shop, explore, and find local services across Marco Island, all in one place.",
  openGraph: {
    title: "Explore the Directory — The Marco Passport",
    description:
      "Find places to stay, eat, shop, explore, and enjoy across Marco Island.",
  },
};

export default function Explore() {
  return <ExplorePage />;
}
