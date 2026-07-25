import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BLOG_CARDS } from "@/data/blogs";

export default function BlogGrid({
  posts,
}: {
  posts: (typeof BLOG_CARDS)[number][];
}) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-border rounded-3xl">
        <p className="text-muted-foreground">
          No stories match your search yet. Try a different keyword or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((p) => (
        <Link
          key={p.slug + p.date}
          href={`/blog/${p.slug}`}
          className="group block rounded-3xl bg-card border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={p.image}
              alt={p.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <span className="absolute top-4 left-4 bg-background/90 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              {p.category}
            </span>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{p.date}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>{p.read}</span>
            </div>
            <h3 className="font-display text-xl font-semibold mt-3 text-primary group-hover:text-gold-foreground transition-colors text-balance">
              {p.title}
            </h3>
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
              {p.excerpt}
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-foreground border-b border-gold pb-0.5 group-hover:gap-2.5 transition-all">
              Read More <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
