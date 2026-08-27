import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PlaceExperience from "@/components/places/PlaceExperience";
import { GetPlacesDetailsBySlugApi } from "@/api/users/places.api";
import { GetRelatesPlaceByCategoryId } from "@/api/users/places.api";
import { mapPlaceToCard, mapPlaceToDetail } from "@/lib/place";
import type { ApiPlace } from "@/types/place";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPlace(slug: string) {
  try {
    const res = await GetPlacesDetailsBySlugApi(slug);
    return res?.data?.data as ApiPlace | undefined;
  } catch (error) {
    console.error("Failed to fetch place details:", error);
    return undefined;
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
      ...(place.categories?.map((category: any) => category.name) || []),
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

  if (!item) {
    return (
      <div className="container mx-auto px-5 py-32 text-center">
        <h1 className="font-display text-4xl font-semibold">Place not found</h1>
        <p className="text-muted-foreground mt-3">
          It may have moved or been removed.
        </p>
        <Link href="/places" className="inline-block mt-6">
          <Button variant="gold">Back to places</Button>
        </Link>
      </div>
    );
  }

  const place = mapPlaceToDetail(item);
  const categoryId = item.categories?.[0]?.id;

  return <PlaceExperience place={place} />;
}