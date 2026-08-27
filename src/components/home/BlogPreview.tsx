import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { blogPosts } from "@/data/content";

export function BlogPreview() {
  return (
    <section className="container mx-auto px-5 py-20 lg:px-8 md:py-28">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em]">
            Stories &amp; Guides
          </p>

          <h2 className="mt-2 font-display text-4xl font-semibold text-balance md:text-5xl">
            From the Journal
          </h2>
        </div>

        <Link
          href="/blog"
          className="font-medium text-primary transition hover:text-gold"
        >
          All Articles →
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <span className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-background opacity-0 transition group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{post.date}</span>

                <span className="h-1 w-1 rounded-full bg-muted-foreground" />

                <span>{post.read}</span>
              </div>

              <h3 className="mt-2 font-display text-2xl font-semibold text-balance transition-colors group-hover:text-primary">
                {post.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-muted-foreground">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
