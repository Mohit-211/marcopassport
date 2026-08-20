import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { places, placesById } from "@/data/places";
import PlaceExperience from "@/components/places/PlaceExperience";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const place = placesById[id];

  if (!place) return {};

  return {
    title: `${place.name} — The Marco Passport`,
    description: place.tagline,
    openGraph: {
      title: `${place.name} — The Marco Passport`,
      description: place.tagline,
      images: [place.image],
    },
    twitter: {
      images: [place.image],
    },
  };
}

export default async function PlaceDetailPage({ params }: Props) {
  const { id } = await params;
  const place = placesById[id];

  if (!place) {
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

  const nearby = places.filter((p) => p.id !== place.id).slice(0, 4);
  // const related = blogPosts.slice(0, 3);

  return <PlaceExperience place={place} nearby={nearby} />;
}
