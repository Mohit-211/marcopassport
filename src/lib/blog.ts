import type { Blog } from "@/types/blog";

const FALLBACK_BLOG_IMAGE = "/assets/blog-1.jpg";

/** A post's cover as a full URL; a post saved without one gets a stock island photo. */
export function blogImage(path?: string | null) {
  return path ? `${process.env.NEXT_PUBLIC_IMAGE_URL ?? ""}${path}` : FALLBACK_BLOG_IMAGE;
}

/** Blog search: the title, description or category contains the query. */
export function matchesBlogQuery(post: Blog, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [post.title, post.description ?? "", post.blog_category?.name ?? ""].some((text) =>
    text.toLowerCase().includes(q),
  );
}
