import { BookOpen } from "lucide-react";
import { magazines } from "@/data/magazines";
import { PageHero, HeroMeta } from "@/components/site/PageHero";

export default function MagazineHero() {
  return (
    <PageHero
      image="/assets/places-hero.jpg"
      icon={BookOpen}
      eyebrow="The publication"
      title={
        <>
          Marco <span className="italic text-gold">Magazine</span>
        </>
      }
      description="A seasonal, print-quality collection of stories, photo essays and field guides — written by the people who live, sail and cook on Marco Island."
    >
      <HeroMeta
        items={[
          `${magazines.length} editions`,
          "Long-form · Photography · Guides",
          "New issue every season",
        ]}
      />
    </PageHero>
  );
}
