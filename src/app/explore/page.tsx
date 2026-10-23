import type { Metadata } from "next";
import { ExplorePage, type ExploreInitialState } from "@/components/explore/ExplorePage";
import { CtaSection } from "@/components/site/CtaSection";

export const metadata: Metadata = {
  title: "Explore Marco Island — The Marco Passport",
  description:
    "Beaches, landmarks and nature spots, plus places to stay, eat, shop and explore across Marco Island, all in one place.",
  openGraph: {
    title: "Explore Marco Island — The Marco Passport",
    description:
      "Find places to visit, stay, eat, shop and enjoy across Marco Island.",
    images: ["/assets/explore-hero.jpg"],
  },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function Explore({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const type = one(params.type);
  const initial: ExploreInitialState = {
    type: type === "place" || type === "business" ? type : "all",
    query: one(params.q) ?? "",
    category: one(params.category),
    featured: one(params.featured) === "true",
  };

  return (
    <>
      <ExplorePage initial={initial} />
      <CtaSection
        eyebrow="Your passport"
        title="Turn what you find into an itinerary"
        description="Add places with a visit date as you browse, put them in order and see the whole route on one map."
        actions={[{ label: "Open My Passport", href: "/passport" }]}
      />
    </>
  );
}
