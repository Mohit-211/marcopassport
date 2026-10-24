"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { GetAllBlogsApi } from "@/api/users/blog.api";
import { blogImage } from "@/lib/blog";
import type { Blog } from "@/types/blog";
export function BlogPreview() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await GetAllBlogsApi();
        const responseData = res?.data?.data;
        if (!Array.isArray(responseData)) {
          console.error("Blogs API did not return an array:", responseData);
          setPosts([]);
          return;
        }
        setPosts(responseData.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);
  if (!loading && posts.length === 0) {
    return null;
  }
  return (
    <section className="site-container py-16 md:py-24">
      <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-gold">
            Local know-how
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-balance text-primary md:text-4xl">
            From the blog
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
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
            >
              <div className="aspect-[16/9] rounded-card bg-muted" />
              <div className="mt-5 h-4 w-1/3 rounded-full bg-muted" />
              <div className="mt-3 h-6 w-3/4 rounded-full bg-muted" />
              <div className="mt-3 h-4 w-full rounded-full bg-muted" />
            </div>
          ))
          : posts.map((post) => (
            <Link
              key={`${post.slug}-${post.id}`}
              href={`/blog/${post.slug}/${post.id}`}
              className="group block"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-card shadow-soft">
                <img
                  src={blogImage(post.featured_image)}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-background opacity-0 transition group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </span>
              </div>
              <div className="mt-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {post.updated_at
                      ? new Date(post.updated_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                      : ""}
                  </span>
                  {post.read_time_minutes ? (
                    <>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>{post.read_time_minutes} min read</span>
                    </>
                  ) : null}
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold text-balance transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-muted-foreground">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}