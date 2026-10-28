import { BookOpen } from "lucide-react";
import { HeroMeta, PageHero } from "@/components/site/PageHero";

export function MagazineHero({ issueCount }: { issueCount: number }) {
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
      description="A seasonal, print-quality collection of features, photo essays and field guides, written by the people who live, sail and cook on Marco Island."
    >
      <HeroMeta
        items={[
          `${issueCount} ${issueCount === 1 ? "issue" : "issues"}`,
          "Features · Photography · Guides",
          "New issue every season",
        ]}
      />
    </PageHero>
  );
}
