import type { BlogPost } from "@/data/blogs";

export default function BlogToc({
  post,
  activeId,
}: {
  post: BlogPost;
  activeId: string;
}) {
  return (
    <nav
      aria-label="On this page"
      className="rounded-2xl border border-border bg-card/60 backdrop-blur p-5"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-foreground">
        On this page
      </p>
      <ul className="mt-4 space-y-3">
        {post.sections.map((s, i) => {
          const active = activeId === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`group flex items-baseline gap-3 text-sm transition-colors ${
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <span
                  className={`text-[10px] tabular-nums ${
                    active ? "text-gold-foreground" : "text-muted-foreground/60"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="leading-snug">{s.heading}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
