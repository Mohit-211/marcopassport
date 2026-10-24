"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete } from "@base-ui/react/autocomplete";
import { Search } from "lucide-react";
import { blogImage, matchesBlogQuery } from "@/lib/blog";
import type { Blog } from "@/types/blog";

const SUGGESTIONS = 6;

/**
 * The blog's search box. Typing filters the page's grid (through
 * onQueryChange) and drops down matching blogs; picking one, by click or
 * Enter, opens it. The list is portalled, so the hero doesn't clip it.
 */
export function BlogSearch({
  posts,
  query,
  onQueryChange,
}: {
  posts: Blog[];
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const router = useRouter();
  const highlighted = useRef<Blog | undefined>(undefined);

  return (
    <Autocomplete.Root
      items={posts}
      value={query}
      onValueChange={(value, details) => {
        if (details.reason === "item-press") {
          const post =
            highlighted.current?.title === value
              ? highlighted.current
              : posts.find((p) => p.title === value);
          if (post) router.push(`/blog/${post.slug}/${post.id}`);
          return;
        }
        onQueryChange(value);
      }}
      onItemHighlighted={(post) => {
        highlighted.current = post;
      }}
      itemToStringValue={(post) => post.title}
      filter={(post, q) => matchesBlogQuery(post, q)}
      limit={SUGGESTIONS}
    >
      <div className="relative max-w-md">
        {/* z-10: the input's backdrop blur would otherwise paint over the icon */}
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-primary-foreground/60"
        />
        <Autocomplete.Input
          aria-label="Search blogs"
          placeholder="Search blogs, tips and guides..."
          className="h-12 w-full min-w-0 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 pr-4 pl-11 text-base text-primary-foreground backdrop-blur-md transition-colors outline-none placeholder:text-primary-foreground/55 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={8} className="z-40 outline-none">
          <Autocomplete.Popup className="max-h-[min(var(--available-height),24rem)] w-(--anchor-width) overflow-y-auto overscroll-contain rounded-tile border border-border bg-popover p-1.5 text-popover-foreground shadow-elegant">
            <Autocomplete.Empty className="px-3 py-4 text-center text-sm text-muted-foreground empty:hidden">
              No blogs match your search.
            </Autocomplete.Empty>
            <Autocomplete.List>
              {(post: Blog) => (
                <Autocomplete.Item
                  key={post.id}
                  value={post}
                  className="flex cursor-pointer items-center gap-3 rounded-mark px-2.5 py-2 outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blogImage(post.featured_image)}
                    alt=""
                    loading="lazy"
                    className="h-10 w-14 shrink-0 rounded-tile object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-primary">{post.title}</span>
                    {post.blog_category?.name && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {post.blog_category.name}
                      </span>
                    )}
                  </span>
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
}
