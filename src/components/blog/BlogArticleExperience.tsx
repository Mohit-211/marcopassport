"use client";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Compass,
  Link2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ShareButton,
  ShareRail,
  TwitterGlyph,
  FacebookGlyph,
} from "@/components/blog/ShareControls";
import type { Blog } from "@/types/blog";

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
  related,
}: {
  post: Blog;
  related: Blog[];
}) {
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
      <section className="relative isolate">
        <div className="relative h-[58vh] min-h-[420px] md:h-[68vh] w-full overflow-hidden">
          {/* <img
            src={imageUrl(post.featured_image)}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          /> */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--primary) 35%, transparent) 0%, color-mix(in oklab, var(--primary) 55%, transparent) 55%, var(--primary) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-5 lg:px-8 pb-14 md:pb-20 max-w-5xl text-primary-foreground">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" /> All Stories
              </Link>
              <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-gold font-semibold mx-4 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-sm">
                {post.blog_category?.name}
              </span>
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
      <section className="container mx-auto px-5 lg:px-8 py-16 md:py-24">
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
                className="mt-8 space-y-5 text-[17px] leading-[1.85] text-foreground/85 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:text-balance [&_h2]:mt-10 [&_img]:rounded-3xl [&_img]:shadow-elegant [&_blockquote]:font-display [&_blockquote]:italic [&_blockquote]:text-2xl [&_blockquote]:md:text-3xl [&_blockquote]:leading-snug [&_blockquote]:text-primary [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-6 [&_blockquote]:md:pl-8 [&_blockquote]:my-10 [&_blockquote]:py-1 [&_blockquote_p]:m-0 [&_.insider-tip]:relative [&_.insider-tip]:rounded-2xl [&_.insider-tip]:bg-gold/10 [&_.insider-tip]:border [&_.insider-tip]:border-gold/25 [&_.insider-tip]:px-6 [&_.insider-tip]:pt-14 [&_.insider-tip]:pb-6 [&_.insider-tip]:my-8 [&_.insider-tip::before]:content-['💡'] [&_.insider-tip::before]:absolute [&_.insider-tip::before]:top-5 [&_.insider-tip::before]:left-6 [&_.insider-tip::before]:text-lg [&_.insider-tip::before]:leading-none [&_.insider-tip::after]:content-['Insider_Tip'] [&_.insider-tip::after]:absolute [&_.insider-tip::after]:top-[1.15rem] [&_.insider-tip::after]:left-14 [&_.insider-tip::after]:bg-gold [&_.insider-tip::after]:text-gold-foreground [&_.insider-tip::after]:text-[11px] [&_.insider-tip::after]:font-bold [&_.insider-tip::after]:uppercase [&_.insider-tip::after]:tracking-[0.12em] [&_.insider-tip::after]:leading-none [&_.insider-tip::after]:px-2.5 [&_.insider-tip::after]:py-1 [&_.insider-tip::after]:rounded-md [&_.insider-tip_p]:m-0 [&_.insider-tip_p]:text-foreground/85"
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
      <section className="bg-sand border-y border-border">
        <div className="container mx-auto px-5 lg:px-8 py-14 md:py-16 max-w-4xl">
          <div className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-elegant">
            <div className="h-12 w-12 rounded-full bg-gold text-gold-foreground flex items-center justify-center shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold font-semibold">
                Continue exploring
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold mt-2 text-balance">
                Find the places and businesses mentioned in this story.
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/explore">
                <Button className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90 px-6">
                  Browse Directory
                </Button>
              </Link>
              <Link href="/places">
                <Button
                  variant="outline"
                  className="rounded-full border-primary-foreground/40 text-black hover:bg-primary-foreground/10 px-6"
                >
                  See Places
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Related */}
      {related.length > 0 && (
        <section className="container mx-auto px-5 lg:px-8 py-20">
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
                  <span className="absolute top-4 left-4 bg-background/90 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {r.blog_category?.name}
                  </span>
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
