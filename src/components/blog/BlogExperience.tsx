"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Newspaper,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BLOG_CARDS, BLOG_CATEGORIES, type BlogCategory } from "@/data/blogs";
import BlogGrid from "@/components/blog/BlogGrid";

const CATEGORIES = BLOG_CATEGORIES;

export default function BlogExperience() {
  const posts = BLOG_CARDS;

  const [activeCat, setActiveCat] = useState<BlogCategory>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCat = activeCat === "All" || p.category === activeCat;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [posts, activeCat, query]);

  const [featured, ...rest] = filtered;
  const totalPages = Math.max(1, Math.ceil(rest.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = rest.slice((safePage - 1) * perPage, safePage * perPage);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate h-[78vh] overflow-hidden bg-primary text-primary-foreground">
        {/* Background */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="/assets/listing-yacht.jpg"
            alt=""
            aria-hidden
            fill
            priority
            className="object-cover object-center blur-3xl scale-125"
            sizes="100vw"
          />
        </div>
        {/* Image treatment */}
        <div className="absolute inset-0 -z-10 bg-primary/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/85 via-primary/40 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/70 via-transparent to-primary/10" />

        {/* Content */}
        <div className="mx-auto flex h-full max-w-7xl items-center px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold sm:mb-5 sm:text-[11px]">
              <span className="h-px w-8 bg-gold/70" />
              <Newspaper className="h-3.5 w-3.5" />
              The Journal
            </div>

            {/* Heading */}

            <h1 className="whitespace-nowrap font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em]">
              From <span className="italic text-gold">Our Blog</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
              Stories, tips and guides for exploring Marco Island like an
              insider, from quiet beaches and stone crab feasts to the kind of
              sunsets you remember for years.
            </p>

            {/* Search */}
            <div className="relative mt-6 max-w-md sm:mt-7">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/60" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search stories, tips and guides..."
                className="h-12 rounded-full border border-white/15 bg-white/10 pl-11 text-primary-foreground placeholder:text-primary-foreground/55 backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="border-b border-border bg-background sticky top-16 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-5 lg:px-8 py-4 flex gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCat(cat);
                  setPage(1);
                }}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  active
                    ? "bg-gold text-gold-foreground border-gold shadow-gold"
                    : "bg-background text-primary border-border hover:border-gold hover:text-gold-foreground hover:bg-gold/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="container mx-auto px-5 lg:px-8 py-14 md:py-20">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            <div className="relative overflow-hidden rounded-3xl aspect-[4/3] shadow-elegant">
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-5 left-5 bg-gold text-gold-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-gold">
                Featured
              </span>
            </div>
            <div>
              <span className="inline-block text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">
                {featured.category}
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold mt-3 text-primary text-balance group-hover:text-gold-foreground transition-colors">
                {featured.title}
              </h2>
              <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span>By {featured.author}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{featured.date}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{featured.read}</span>
              </div>
              <div className="mt-7 inline-flex items-center gap-2 text-gold-foreground font-semibold border-b-2 border-gold pb-1 group-hover:gap-3 transition-all">
                Read More <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid */}
      <section className="container mx-auto px-5 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary">
              Latest Stories
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
              {activeCat !== "All" && (
                <>
                  {" "}
                  in{" "}
                  <span className="text-primary font-medium">{activeCat}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <BlogGrid posts={paged} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
              const active = n === safePage;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-10 w-10 rounded-full text-sm font-semibold transition-all ${
                    active
                      ? "bg-gold text-gold-foreground shadow-gold"
                      : "bg-background text-primary border border-border hover:border-gold"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {n}
                </button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
