import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fetchExploreItems } from "@/api/users/explore.api";
import { ExploreCard } from "@/components/explore/ExploreCard";
import { interleave, type ExploreItem } from "@/lib/explore";

const LIMIT = 6;

async function getFeatured(): Promise<ExploreItem[]> {
  try {
    const { items } = await fetchExploreItems({ featured: true, limit: LIMIT });
    const featured = interleave(
      items.filter((i) => i.type === "place"),
      items.filter((i) => i.type === "business"),
    );
    if (featured.length >= 3) return featured.slice(0, LIMIT);
    // Too few featured listings yet: top them up with the best of the rest.
    const { items: rest } = await fetchExploreItems({ limit: LIMIT });
    const seen = new Set(featured.map((i) => `${i.type}:${i.id}`));
    const extra = interleave(
      rest.filter((i) => i.type === "place"),
      rest.filter((i) => i.type === "business"),
    ).filter((i) => !seen.has(`${i.type}:${i.id}`));
    return [...featured, ...extra].slice(0, LIMIT);
  } catch (error) {
    console.error("Failed to fetch featured listings:", error);
    return [];
  }
}

/**
 * The home page's one featured section: places to visit and businesses
 * together, the same cards as Explore.
 */
export async function FeaturedListings() {
  const items = await getFeatured();
  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="site-container">
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Hand-picked</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-balance text-primary md:text-4xl">
              Featured on Marco Island
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              The beaches, landmarks and local businesses we think are worth your time.
            </p>
          </div>
          <Link
            href="/explore?featured=true"
            className="group hidden shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-gold sm:inline-flex"
          >
            View all
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ExploreCard key={`${item.type}:${item.id}`} item={item} />
          ))}
        </div>

        <Link
          href="/explore?featured=true"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-primary sm:hidden"
        >
          View all <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
