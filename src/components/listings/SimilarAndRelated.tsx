import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/types/blog";

type SimilarAndRelatedProps = {
  similar: {
    slug: string;
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    featured?: boolean;
  }[];
  relatedBlog: Blog[];
};

function blogImageUrl(image?: string) {
  if (!image) return "/assets/blog-1.jpg";
  return `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${image}`;
}

function blogDate(dateString?: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function SimilarAndRelated({
  similar,
  relatedBlog,
}: SimilarAndRelatedProps) {
  return (
    <>
      {/* Similar listings */}
      <section className="bg-sand py-16 md:py-24">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                You may also like
              </p>
              <h2 className="font-display text-4xl font-semibold mt-2">
                Similar on the island
              </h2>
            </div>
            <Link href="/explore">
              <Button variant="outline">Browse the directory</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {similar.map((l) => (
              <Link
                key={l.id}
                href={`/listings/${l.slug}`}
                className="group bg-card rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 block"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={l.image}
                    alt={l.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {l.featured && (
                    <span className="absolute top-4 left-4 bg-gold text-gold-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      ★ Featured
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {l.category}
                  </span>
                  <h3 className="font-display text-xl font-semibold mt-1 group-hover:text-primary transition">
                    {l.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {l.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related reads */}
      <section className="container mx-auto px-5 lg:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              Related reads
            </p>
            <h2 className="font-display text-4xl font-semibold mt-2">
              From the journal
            </h2>
          </div>
          <Link href="/blog" className="hidden sm:inline-block">
            <Button variant="ghost">All stories</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedBlog.map((p) => (
            <Link
              key={`${p.slug}-${p.id}`}
              href={`/blog/${p.slug}/${p.id}`}
              className="group block"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={blogImageUrl(p.featured_image)}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-4">
                {blogDate(p.updated_at)}
              </p>
              <h3 className="font-display text-xl font-semibold mt-1 group-hover:text-primary transition">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {p.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
