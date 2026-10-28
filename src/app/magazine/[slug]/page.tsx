import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IssueGrid } from "@/features/magazine/components/IssueCard";
import { IssueExperience } from "@/features/magazine/components/IssueExperience";
import { issueLine, magazineImage } from "@/features/magazine/model";
import { img } from "@/features/magazine/renderer/content";
import { getMagazineIssue, getMagazineShelf } from "@/features/magazine/shelf";

export const revalidate = 600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getMagazineIssue(slug);
  if (!issue) return {};

  const title = `${[issue.title, issueLine(issue)].filter(Boolean).join(" · ")} — Marco Magazine`;
  const description = issue.description || issue.tagline || undefined;
  const cover = issue.pages[0] ? img(issue.pages[0].content, "image") : null;
  const images = cover ? [magazineImage(cover.src)] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
    alternates: { canonical: `/magazine/${issue.slug}` },
  };
}

export default async function MagazineIssuePage({ params }: Props) {
  const { slug } = await params;
  const issue = await getMagazineIssue(slug);
  if (!issue) notFound();

  const { issues } = await getMagazineShelf();
  const more = issues.filter((other) => other.slug !== issue.slug).slice(0, 3);

  return (
    <>
      <IssueExperience issue={issue} />
      {more.length > 0 && (
        <section className="border-t border-border bg-cream py-16 md:py-24">
          <div className="site-container">
            <p className="eyebrow text-gold">Keep reading</p>
            <h2 className="mt-2 mb-12 text-3xl font-semibold text-primary md:text-4xl">More issues</h2>
            <IssueGrid issues={more} />
          </div>
        </section>
      )}
    </>
  );
}
