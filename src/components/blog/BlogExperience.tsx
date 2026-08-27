"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
import BlogGrid from "@/components/blog/BlogGrid";
import {
  GetAllBlogsApi,
  GetAllBlogsByCategoryApi,
  GetBlogCategoryApi,
} from "@/api/users/blog.api";
import type { Blog } from "@/types/blog";
type ApiCategory = {
  id: string | number;
  name?: string;
  title?: string;
  category_name?: string;
  slug?: string;
};
type BlogCategoryOption = {
  name: string;
  slug: string;
};
const ALL_CATEGORY_SLUG = "all";
export default function BlogExperience() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [blogError, setBlogError] = useState("");
  const [categories, setCategories] = useState<BlogCategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [activeCat, setActiveCat] = useState<string>(ALL_CATEGORY_SLUG);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError("");
        const res = await GetBlogCategoryApi();
        const responseData = res?.data?.data ?? res?.data ?? [];
        if (!Array.isArray(responseData)) {
          console.error(
            "Blog category API did not return an array:",
            responseData
          );
          setCategories([]);
          setCategoryError("Unable to load categories.");
          return;
        }
        const categoryOptions = responseData
          .map((category: ApiCategory | string) => {
            if (typeof category === "string") {
              return { name: category, slug: category };
            }
            const name =
              category.name ||
              category.title ||
              category.category_name ||
              "";
            return { name, slug: category.slug || name };
          })
          .filter((category) => Boolean(category.name));
        const uniqueCategories = Array.from(
          new Map(
            categoryOptions.map((category) => [category.slug, category])
          ).values()
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch blog categories:", error);
        setCategories([]);
        setCategoryError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true);
        setBlogError("");
        const res =
          activeCat === ALL_CATEGORY_SLUG
            ? await GetAllBlogsApi()
            : await GetAllBlogsByCategoryApi(activeCat);
        const responseData = res?.data?.data;
        if (!Array.isArray(responseData)) {
          console.error("Blogs API did not return an array:", responseData);
          setBlogError("Unable to load blogs.");
          setPosts([]);
          return;
        }
        setPosts(responseData);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogError("Failed to load blogs.");
        setPosts([]);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchBlogs();
  }, [activeCat]);
  const activeCatName = useMemo(() => {
    if (activeCat === ALL_CATEGORY_SLUG) return "All";
    return (
      categories.find((c) => c.slug === activeCat)?.name ?? "All"
    );
  }, [categories, activeCat]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        (p.blog_category?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [posts, query]);
  const [featured, ...rest] = filtered;
  const totalPages = Math.max(
    1,
    Math.ceil(rest.length / perPage)
  );
  const safePage = Math.min(page, totalPages);

  return (
    <>
      <section className="relative isolate h-[78vh] overflow-hidden bg-primary text-primary-foreground">
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
            <h1 className="font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
              From{" "}
              <span className="italic text-gold">
                Our Blog
              </span>
            </h1>
            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
              Stories, tips and guides for exploring Marco
              Island like an insider, from quiet beaches and
              stone crab feasts to the kind of sunsets you
              remember for years.
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
      {/* =====================================================
          CATEGORY PILLS
      ====================================================== */}
      <section className="border-b border-border bg-background sticky top-16 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto max-w-7xl py-4 flex gap-2 overflow-x-auto scrollbar-none">
          {/* Loading */}
          {loadingCategories && (
            <>
              <button
                type="button"
                disabled
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium border border-border bg-muted text-muted-foreground"
              >
                Loading categories...
              </button>
            </>
          )}
          {/* Error */}
          {!loadingCategories && categoryError && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-red-500">
                {categoryError}
              </span>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-gold-foreground underline"
              >
                Retry
              </button>
            </div>
          )}
          {/* Categories */}
          {!loadingCategories &&
            !categoryError &&
            [{ name: "All", slug: ALL_CATEGORY_SLUG }, ...categories].map(
              (cat) => {
                const active = activeCat === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      setActiveCat(cat.slug);
                      setPage(1);
                    }}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${active
                      ? "bg-gold text-gold-foreground border-gold shadow-gold"
                      : "bg-background text-primary border-border hover:border-gold hover:text-gold-foreground hover:bg-gold/10"
                      }`}
                  >
                    {cat.name}
                  </button>
                );
              }
            )}
        </div>
      </section>
      {/* =====================================================
          FEATURED
      ====================================================== */}
      {featured && (
        <section className="container mx-auto max-w-7xl py-14 md:py-20">
          <Link
            href={`/blog/${featured.slug}/${featured?.id}`}
            className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            <div className="relative overflow-hidden rounded-3xl aspect-[16/9] shadow-elegant">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${featured.featured_image}`}
                alt={featured.title}
                loading="lazy"
                className="h-full w-full transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute top-5 left-5 bg-gold text-gold-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-gold">
                Featured
              </span>
            </div>
            <div>
              <span className="inline-block text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">
                {featured.blog_category?.name}
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold mt-3 text-primary text-balance group-hover:text-gold-foreground transition-colors">
                {featured.title}
              </h2>
              <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
                {featured.description}
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span>By {featured.written_by}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>
                  {featured.updated_at
                    ? new Date(featured.updated_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    : ""}
                </span>
                {/* <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{featured.read}</span> */}
              </div>
              <div className="mt-7 inline-flex items-center gap-2 text-gold-foreground font-semibold border-b-2 border-gold pb-1 group-hover:gap-3 transition-all">
                Read More
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </section>
      )}
      {/* =====================================================
          BLOG GRID
      ====================================================== */}
      <section className="container mx-auto max-w-7xl pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary">
              Latest Stories
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {filtered.length}{" "}
              {filtered.length === 1
                ? "article"
                : "articles"}
              {activeCat !== ALL_CATEGORY_SLUG && (
                <>
                  {" "}
                  in{" "}
                  <span className="text-primary font-medium">
                    {activeCatName}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <BlogGrid posts={posts} />
        {/* =====================================================
            PAGINATION
        ====================================================== */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            {/* Previous */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {/* Page numbers */}
            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((n) => {
              const active = n === safePage;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`h-10 w-10 rounded-full text-sm font-semibold transition-all ${active
                    ? "bg-gold text-gold-foreground shadow-gold"
                    : "bg-background text-primary border border-border hover:border-gold"
                    }`}
                  aria-current={
                    active ? "page" : undefined
                  }
                >
                  {n}
                </button>
              );
            })}
            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
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