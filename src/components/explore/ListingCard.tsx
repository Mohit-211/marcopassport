import Link from "next/link";
import { Star, MapPin, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Listing = {
  categories: any;
  is_in_passport: boolean;
  slug: string;
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  
  image: string;
  rating: number;
  price: string;
  location: string;
  description: string;
  featured: boolean;
  website_url?: string;
  about?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  fees?: string | null;
  parking?: string | null;
  best_time_to_visit?: string | null;
  insider_tips?: string | null;
  what_to_expect?: string | null;
  highlights?: string | null;
  reviewCount?: number;
  galleryImages?: string[];
};

// export const allListings: Listing[] = [
//   ...featuredListings.map((l) => ({ ...l })),
//   ...featuredListings.map((l, i) => ({
//     ...l,
//     id: l.id + "-b",
//     name: l.name.replace(
//       /Resort|Table|Charters/,
//       (m) =>
//         (
//           ({
//             Resort: "Suites",
//             Table: "House",
//             Charters: "Excursions",
//           }) as Record<string, string>
//         )[m] ?? m
//     ),
//     featured: i === 0,
//     rating: Math.max(4.3, l.rating - 0.2),
//   })),
//   ...featuredListings.map((l) => ({
//     ...l,
//     id: l.id + "-c",
//     name: l.name.replace(
//       /Marco|Tide|Azure/,
//       (m) =>
//         (
//           ({ Marco: "Calusa", Tide: "Mangrove", Azure: "Esplanade" }) as Record<
//             string,
//             string
//           >
//         )[m] ?? m
//     ),
//     featured: false,
//     rating: 4.5,
//   })),
//   ...featuredListings.map((l) => ({
//     ...l,
//     id: l.id + "-d",
//     name: l.name.replace(
//       /Beachfront|Sunset|Sailing/,
//       (m) =>
//         (
//           ({
//             Beachfront: "Bayfront",
//             Sunset: "Harbor",
//             Sailing: "Eco",
//           }) as Record<string, string>
//         )[m] ?? m
//     ),
//     featured: false,
//     rating: 4.6,
//   })),
// ];

export function ListingCard({ listing: l }: { listing: Listing }) {
  return (
    <article className="group bg-card rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 flex flex-col">
      <div className="relative aspect-[16/9] overflow-hidden">
      
        <img
          src={l.image}
          alt={l.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/40 to-transparent" />
        {l.featured && (
          <span className="absolute top-4 left-4 bg-gold text-gold-foreground text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full shadow-soft">
            ★ Featured
          </span>
        )}
        <button
          className="absolute top-4 right-4 grid place-items-center h-10 w-10 rounded-full bg-background/90 hover:bg-gold hover:text-gold-foreground transition"
          aria-label={`Save ${l.name}`}
        >
           <Bookmark className="h-4 w-4" fill={l.is_in_passport === true ? "currentColor" : "none"} />

        </button>
        <span className="absolute bottom-3 left-4 text-[11px] uppercase tracking-wider font-semibold text-primary-foreground/95">
          {l.category}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold leading-tight">
            {l.name}
          </h3>
          <span className="inline-flex items-center gap-1 text-gold font-semibold text-sm shrink-0">
            <Star className="h-4 w-4 fill-gold" /> {l.rating.toFixed(1)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground inline-flex items-center gap-1 mt-1.5">
          <MapPin className="h-3.5 w-3.5" /> {l.location}
          <span className="mx-1.5 opacity-40">·</span>
          <span className="font-medium">{l.price}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {l.description}
          
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link href={`/listings/${l.slug}`}>
            <Button variant="default" size="sm" className="w-full">
              View details
            </Button>
          </Link>
          {l.website_url ? (
            <a href={l.website_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-3.5 w-3.5" /> Website
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" className="w-full" disabled>
              <ExternalLink className="h-3.5 w-3.5" /> Website
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
