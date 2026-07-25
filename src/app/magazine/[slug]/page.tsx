import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { magazines, magazinesBySlug } from "@/data/magazines";
import MagazineExperience from "@/components/magazine/MagazineExperience";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const magazine = magazinesBySlug[slug];

  if (!magazine) return {};

  return {
    title: `${magazine.title} · ${magazine.issue} — Marco Magazine`,
    description: magazine.description,
    openGraph: {
      title: `${magazine.title} · ${magazine.issue}`,
      description: magazine.description,
      images: [magazine.cover],
    },
    twitter: {
      images: [magazine.cover],
    },
  };
}

export default async function MagazineDetailPage({ params }: Props) {
  const { slug } = await params;
  const magazine = magazinesBySlug[slug];

  if (!magazine) {
    return (
      <div className="container mx-auto px-5 py-32 text-center">
        <h1 className="font-display text-4xl font-semibold">
          Edition not found
        </h1>
        <p className="text-muted-foreground mt-3">It may have been archived.</p>
        <Link href="/magazine" className="inline-block mt-6">
          <Button variant="gold">Back to magazine</Button>
        </Link>
      </div>
    );
  }

  const others = magazines.filter((m) => m.slug !== magazine.slug).slice(0, 4);

  return <MagazineExperience magazine={magazine} others={others} />;
}
