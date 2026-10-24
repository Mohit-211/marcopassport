import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ExploreDetail from "@/components/explore/ExploreDetail";
import { fetchExploreDetail } from "@/api/users/explore.api";
import { toExploreDetail } from "@/lib/explore-detail";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * The place, or undefined when no place has this slug (the page then answers
 * 404). Cached so the metadata and the page share one lookup per request.
 */
const getPlace = cache(async (slug: string) => {
  const found = await fetchExploreDetail(slug);
  return found ? toExploreDetail(found.item, found.type) : undefined;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) return {};

  const title = `${place.name} — The Marco Passport`;
  const description =
    place.summary ||
    place.about.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160) ||
    undefined;

  return {
    title,
    description,
    keywords: [place.name, place.neighborhood, ...place.categories.map((category) => category.name)].filter(Boolean),
    openGraph: { title, description, images: [place.image] },
    twitter: { card: "summary_large_image", title, description, images: [place.image] },
    alternates: { canonical: `/explore/${place.slug}` },
  };
}

export default async function ExplorePlacePage({ params }: Props) {
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) notFound();

  return <ExploreDetail place={place} />;
}
