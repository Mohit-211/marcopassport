import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { magazines } from "@/data/magazines";
import { CoverMockup } from "@/components/magazine/CoverMockup";

function MagazineCard({ magazine }: { magazine: (typeof magazines)[number] }) {
  return (
    <Link href={`/magazine/${magazine.slug}`} className="group block">
      <CoverMockup magazine={magazine} />
      <div className="mt-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
          {magazine.issue} · {magazine.season}
        </p>
        <h3 className="font-display text-2xl font-semibold mt-2 text-balance group-hover:text-primary transition-colors">
          {magazine.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {magazine.description}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-primary">
          Read issue
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function MagazineGrid({
  magazines: list,
}: {
  magazines: (typeof magazines)[number][];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
      {list.map((m) => (
        <MagazineCard key={m.slug} magazine={m} />
      ))}
    </div>
  );
}
