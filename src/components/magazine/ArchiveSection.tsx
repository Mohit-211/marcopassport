import Link from "next/link";
import { magazines } from "@/data/magazines";

export default function ArchiveSection({
  archive,
}: {
  archive: (typeof magazines)[number][];
}) {
  if (archive.length === 0) return null;

  return (
    <section className="bg-primary text-primary-foreground py-20 md:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-12 border-b border-primary-foreground/15 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              The archive
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 text-balance">
              Past editions
            </h2>
          </div>
          <p className="hidden md:block text-sm text-primary-foreground/60 max-w-xs text-right">
            Out of season — still worth reading.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {archive.map((m) => (
            <Link
              key={m.slug}
              href={`/magazine/${m.slug}`}
              className="group block"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-md shadow-elegant ring-1 ring-primary-foreground/10 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:ring-gold/40">
                <img
                  src={m.cover}
                  alt={`${m.title} ${m.issue}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/0 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold/90">
                    {m.issue}
                  </p>
                  <p className="font-display text-sm leading-tight mt-0.5 text-primary-foreground">
                    {m.title}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">
                {m.season}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
