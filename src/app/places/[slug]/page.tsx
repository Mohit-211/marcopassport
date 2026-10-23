import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaceExperience from "@/components/places/PlaceExperience";
import { GetPlacesDetailsBySlugApi } from "@/api/users/places.api";
import { isNotFoundError } from "@/errors/apiError";
import { mapPlaceToDetail } from "@/lib/place";
import type { ApiPlace } from "@/types/place";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * The place, or undefined when the API says there's no such place (the page
 * then answers 404). Any other failure throws, so it reaches the error page.
 */
async function getPlace(slug: string) {
  try {
    const res = await GetPlacesDetailsBySlugApi(slug);
    return (res?.data?.data as ApiPlace | undefined) ?? undefined;
  } catch (error) {
    if (isNotFoundError(error)) return undefined;
    throw error;
  }
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPlace(slug);
  if (!item) return {};

  const place = mapPlaceToDetail(item);
  const description =
    place.short_description || place.about?.replace(/<[^>]*>/g, "").slice(0, 160);

  return {
    title: `${place.name} — The Marco Passport`,
    description,
    keywords: [
      place.name,
      place.neighborhood,
      ...(place.categories?.map((category) => category.name) || []),
    ],
    openGraph: {
      title: `${place.name} — The Marco Passport`,
      description,
      images: [
     place.featured_image
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${place.name} — The Marco Passport`,
      description: place.short_description,
      images: [place.featured_image || place.image],
    },
    alternates: {
      canonical: `https://themarcopassport.com/places/${place.slug}`,
    },
  };
}

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPlace(slug);
  if (!item) notFound();

  const place = mapPlaceToDetail(item);
  return <PlaceExperience place={place} />;
}