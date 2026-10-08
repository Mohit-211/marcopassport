import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Blog } from "@/types/blog";

export default function BlogGrid({
  posts,
}: {
  posts: Blog[];
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
          key={`${p.slug}-${p.id?? ""}`}
          href={`/blog/${p.slug}/${p.id}`}
          className="group flex flex-col h-full rounded-3xl bg-card border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="relative overflow-hidden aspect-[16/9]">
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${p.featured_image}`}
              alt={p.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {p.blog_category?.name && (
              <span className="absolute top-4 left-4 bg-background/90 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                {p.blog_category.name}
              </span>
            )}
          </div>

          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{p.updated_at
                ? new Date(p.updated_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
                : ""}</span>

              {/* <span className="h-1 w-1 rounded-full bg-muted-foreground" />

              <span>{p.read || ""}</span> */}
            </div>

            <h3 className="font-display text-xl font-semibold mt-3 text-primary group-hover:text-gold-foreground transition-colors text-balance">
              {p.title}
            </h3>

            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
              {p.description || ""}
            </p>

            <div className="mt-auto pt-5 self-start inline-flex items-center gap-1.5 text-sm font-semibold text-gold-foreground border-b border-gold pb-0.5 group-hover:gap-2.5 transition-all">
              Read More

              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}