"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Link2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { CtaSection } from "@/components/site/CtaSection";
import {
  ShareButton,
  ShareRail,
  TwitterGlyph,
  FacebookGlyph,
} from "@/components/blog/ShareControls";
import { GetAllBlogsByCategoryApi } from "@/api/users/blog.api";
import type { Blog } from "@/types/blog";
import { HeroBackground } from "@/components/site/HeroBackground";
const imageUrl = (image?: string) =>
  image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${image}` : "/assets/blog-1.jpg";
const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "";
export default function BlogArticleExperience({
  post,
  related: relatedProp,
}: {
  post: Blog;
  related?: Blog[];
}) {
  const categorySlug = post.blog_category?.slug;
  const [relatedState, setRelated] = useState<Blog[]>(relatedProp ?? []);
  const related = categorySlug ? relatedState : [];
  useEffect(() => {
    if (!categorySlug) return;
    const fetchRelated = async () => {
      try {
        const res = await GetAllBlogsByCategoryApi(categorySlug);
        const responseData = res?.data?.data;
        setRelated(Array.isArray(responseData) ? responseData : []);
      } catch (error) {
        console.error("Failed to fetch related blogs:", error);
      }
    };
    fetchRelated();
  }, [categorySlug, post.id]);
  const handleShare = (type: "twitter" | "facebook" | "copy") => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const text = post.title;
    if (type === "copy") {
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success("Link copied"));
      return;
    }
    const href =
      type === "twitter"
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };
  return (
    <>
      {/* Hero */}
      <section className="hero-viewport">
          <HeroBackground src={imageUrl(post.featured_image)} alt={post.title} />
          <div className="hero-container">
            <div className="w-full max-w-5xl text-primary-foreground">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" /> All Stories
              </Link>
              {post.blog_category?.name && (
                <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-gold font-semibold mx-4 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-sm">
                  {post.blog_category.name}
                </span>
              )}
              <h1 className="font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] mt-4 text-balance">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-foreground/85">
                {post.written_by && (
                  <span className="inline-flex items-center gap-2">
                    <User className="h-4 w-4" /> {post.written_by}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> {formatDate(post.updated_at || post.published_at)}
                </span>
                {post.read_time_minutes != null && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {post.read_time_minutes} min read
                  </span>
                )}
              </div>
            </div>
          </div>
      </section>
      {/* Featured image */}
      {post.featured_image && (
        <section className="mt-20">
          <div className="max-w-2xl mx-auto">
            <img
              src={imageUrl(post.featured_image)}
              alt={post.title}
              className="w-full aspect-[16/9] object-cover rounded-xl shadow-elegant"
            />
          </div>
        </section>
      )}
      {/* Body */}
      <section className="site-container py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr_minmax(0,680px)_1fr] gap-10">
          {/* Left: floating share */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-10">
              <ShareRail onShare={handleShare} />
            </div>
          </aside>
          {/* Center: article */}
          <article className="min-w-0">
            {post.description && (
              <p className="font-display text-2xl md:text-[26px] leading-relaxed text-primary first-letter:float-left first-letter:text-6xl first-letter:font-semibold first-letter:mr-3 first-letter:mt-1 first-letter:text-gold-foreground first-letter:leading-none">
                {post.description}
              </p>
            )}
            {post.content && (
              <div
                className="blog-content mt-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
            {/* Author + share */}
            <div className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              {post.written_by && (
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-lg">
                    {post.written_by.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Written by</p>
                    <p className="font-semibold text-primary">{post.written_by}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-muted-foreground mr-2">
                  Share
                </span>
                <ShareButton
                  onClick={() => handleShare("twitter")}
                  aria-label="Share on Twitter"
                >
                  <TwitterGlyph />
                </ShareButton>
                <ShareButton
                  onClick={() => handleShare("facebook")}
                  aria-label="Share on Facebook"
                >
                  <FacebookGlyph />
                </ShareButton>
                <ShareButton
                  onClick={() => handleShare("copy")}
                  aria-label="Copy link"
                >
                  <Link2 className="h-4 w-4" />
                </ShareButton>
              </div>
            </div>
          </article>
          <div className="hidden lg:block" />
        </div>
      </section>
      {/* Inline CTA back into the platform */}
      <CtaSection
        eyebrow="Continue exploring"
        title="Find the places and businesses mentioned in this story."
        actions={[
          { label: "Browse Directory", href: "/explore" },
          { label: "See Places", href: "/places" },
        ]}
      />
      {/* Related */}
      {related.length > 0 && (
        <section className="site-container py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                Keep reading
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2 text-primary">
                Related Stories
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gold-foreground border-b-2 border-gold pb-0.5"
            >
              All Stories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}/${r.id}`}
                className="group block rounded-3xl bg-card border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img
                    src={imageUrl(r.featured_image)}
                    alt={r.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {r.blog_category?.name && (
                    <span className="absolute top-4 left-4 bg-background/90 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {r.blog_category.name}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(r.updated_at)}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold mt-3 text-primary group-hover:text-gold-foreground transition-colors text-balance">
                    {r.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {r.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}