"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Compass,
  Link2,
  Lightbulb,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { BlogPost, getRelatedBlogs } from "@/data/blogs";
import BlogToc from "@/components/blog/BlogToc";
import {
  ShareButton,
  ShareRail,
  TwitterGlyph,
  FacebookGlyph,
} from "@/components/blog/ShareControls";

export default function BlogArticleExperience({
  post,
  related,
}: {
  post: BlogPost;
  related: ReturnType<typeof getRelatedBlogs>;
}) {
  const [activeSection, setActiveSection] = useState<string>(
    post.sections[0]?.id ?? ""
  );

  // Scrollspy
  useEffect(() => {
    const ids = post.sections.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [post.slug, post.sections]);

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
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
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
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" /> All Stories
              </Link>
              <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-gold font-semibold">
                {post.category}
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-semibold mt-4 text-balance leading-tight">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-foreground/85">
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4" /> {post.author}{" "}
                  <span className="text-primary-foreground/55">
                    · {post.authorRole}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> {post.date}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {post.read}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto px-5 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr_minmax(0,680px)_1fr] gap-10">
          {/* Left: floating share + TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-10">
              <ShareRail onShare={handleShare} />
              <BlogToc post={post} activeId={activeSection} />
            </div>
          </aside>

          {/* Center: article */}
          <article className="min-w-0">
            <p className="font-display text-2xl md:text-[26px] leading-relaxed text-primary first-letter:float-left first-letter:text-6xl first-letter:font-semibold first-letter:mr-3 first-letter:mt-1 first-letter:text-gold-foreground first-letter:leading-none">
              {post.intro}
            </p>

            {/* Mobile TOC */}
            <div className="lg:hidden mt-10">
              <BlogToc post={post} activeId={activeSection} />
            </div>

            <div className="mt-12 space-y-14">
              {post.sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary text-balance">
                    {s.heading}
                  </h2>
                  <div className="mt-5 space-y-5 text-[17px] leading-[1.85] text-foreground/85">
                    {s.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  {s.image && (
                    <figure className="mt-8">
                      <div className="overflow-hidden rounded-3xl shadow-elegant">
                        <img
                          src={s.image}
                          alt={s.imageCaption ?? s.heading}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      {s.imageCaption && (
                        <figcaption className="mt-3 text-center text-xs uppercase tracking-widest text-muted-foreground">
                          {s.imageCaption}
                        </figcaption>
                      )}
                    </figure>
                  )}

                  {s.pullquote && (
                    <blockquote className="mt-10 border-l-2 border-gold pl-6 md:pl-8">
                      <p className="font-display text-2xl md:text-3xl text-primary italic leading-snug text-balance">
                        “{s.pullquote}”
                      </p>
                    </blockquote>
                  )}

                  {s.tip && (
                    <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/10 p-5 flex gap-4">
                      <Lightbulb className="h-5 w-5 text-gold-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gold-foreground">
                          Insider tip
                        </p>
                        <p className="text-sm text-primary mt-1 leading-relaxed">
                          {s.tip}
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Author + share */}
            <div className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-lg">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Written by</p>
                  <p className="font-semibold text-primary">{post.author}</p>
                </div>
              </div>
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
                  className="rounded-full border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 px-6"
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
                href={`/blog/${r.slug}`}
                className="group block rounded-3xl bg-card border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={r.image}
                    alt={r.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 bg-background/90 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {r.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{r.date}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    <span>{r.read}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold mt-3 text-primary group-hover:text-gold-foreground transition-colors text-balance">
                    {r.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {r.excerpt}
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
