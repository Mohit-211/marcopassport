import type { Metadata } from "next";
import { CtaSection } from "@/components/site/CtaSection";
import { FeaturedIssue } from "@/features/magazine/components/FeaturedIssue";
import { IssueArchive } from "@/features/magazine/components/IssueArchive";
import { IssueGrid } from "@/features/magazine/components/IssueCard";
import { MagazineHero } from "@/features/magazine/components/MagazineHero";
import { getMagazineShelf } from "@/features/magazine/shelf";

// Issues come from the API (or the samples while none are published);
// refresh them every 10 minutes, like the home page.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Marco Magazine — The Marco Passport",
  description:
    "Features, photo essays and field guides exploring the places, people, food and character of Marco Island, Florida.",
  openGraph: {
    title: "Marco Magazine — The Marco Passport",
    description: "Features, photo essays and field guides from around Marco Island, Florida.",
    images: ["/assets/places-hero.jpg"],
  },
};

/** Recent issues on the shelf; anything older goes to the archive. */
const ON_THE_SHELF = 6;

export default async function MagazinePage() {
  const { issues, featured } = await getMagazineShelf();
  const others = issues.filter((issue) => issue.slug !== featured.slug);
  const shelf = others.slice(0, ON_THE_SHELF);
  const archive = others.slice(ON_THE_SHELF);

  return (
    <>
      <MagazineHero issueCount={issues.length} />
      <FeaturedIssue issue={featured} />

      {shelf.length > 0 && (
        <section className="site-container py-16 md:py-24">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold">The collection</p>
              <h2 className="mt-2 text-3xl font-semibold text-balance text-primary md:text-4xl">On the shelf</h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm text-muted-foreground md:block">
              Each issue is a self-contained guide. Read in any order.
            </p>
          </div>
          <IssueGrid issues={shelf} />
        </section>
      )}

      <IssueArchive issues={archive} />

      <CtaSection
        eyebrow="Stay in print"
        title="The next issue, in your inbox"
        description="One email per season. New features, new photographers, no noise."
        actions={[{ label: "Subscribe", href: "/contact" }]}
      />
    </>
  );
}
