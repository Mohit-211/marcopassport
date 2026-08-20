"use client";

import { useState } from "react";
import { Star, MapPin, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type ListingGalleryProps = {
  listing: {
    id: string;
    name: string;
    category: string;
    image: string;
    location: string;
    price: string;
    rating: number;
    featured?: boolean;
    reviewCount?: number;
    galleryImages?: string[];
  };
};

export default function ListingGallery({ listing }: ListingGalleryProps) {
  console.log(listing,"listing====")
  const gallery =
    listing.galleryImages && listing.galleryImages.length > 0
      ? listing.galleryImages
      : [listing.image];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImg = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % gallery.length));
  const prevImg = () =>
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + gallery.length) % gallery.length
    );

  return (
    <>
      <section className="container mx-auto px-5 lg:px-8 mt-6">
        <div className="grid md:grid-cols-4 gap-3 rounded-3xl overflow-hidden">
          <button
            onClick={() => openLightbox(0)}
            className="md:col-span-3 md:row-span-2 relative aspect-[16/10] md:aspect-auto md:h-[520px] overflow-hidden group"
          >
            <img
              src={gallery[0]}
              alt={listing.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
            <div className="absolute top-5 left-5 flex items-center gap-2">
              {listing.featured && (
                <Badge className="bg-gold text-gold-foreground hover:bg-gold border-0 uppercase tracking-[0.18em] text-[10px] font-bold px-3 py-1.5">
                  ★ Featured
                </Badge>
              )}
              <Badge
                variant="secondary"
                className="bg-background/90 backdrop-blur text-foreground border-0 uppercase tracking-wider text-[10px]"
              >
                {listing.category}
              </Badge>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-primary-foreground text-left">
              <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] text-balance">
                {listing.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/90">
                <span className="inline-flex items-center gap-1.5 text-gold font-semibold">
                  <Star className="h-4 w-4 fill-gold" />{" "}
                  {listing.rating.toFixed(1)}
                  {typeof listing.reviewCount === "number" && (
                    <span className="text-primary-foreground/70 font-normal">
                      ({listing.reviewCount} reviews)
                    </span>
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {listing.location}
                </span>
                <span className="font-medium">{listing.price}</span>
              </div>
            </div>
          </button>

          {gallery.slice(1, 5).map((src, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i + 1)}
              className="relative aspect-[4/3] md:aspect-auto md:h-[254px] overflow-hidden group hidden md:block"
            >
              <img
                src={src}
                alt={`${listing.name} ${i + 2}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {i === 3 && (
                <div className="absolute inset-0 grid place-items-center bg-primary/70 text-primary-foreground text-sm font-semibold uppercase tracking-wider">
                  + View all {gallery.length}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(o) => !o && closeLightbox()}
      >
        <DialogContent className="max-w-6xl p-0 bg-primary border-0 overflow-hidden">
          {lightboxIndex !== null && (
            <div className="relative">
              <img
                src={gallery[lightboxIndex]}
                alt={`${listing.name} ${lightboxIndex + 1}`}
                className="w-full h-[80vh] object-contain bg-primary"
              />
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 grid place-items-center h-10 w-10 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={prevImg}
                className="absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center h-12 w-12 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center h-12 w-12 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-primary-foreground/80 bg-background/20 px-3 py-1 rounded-full">
                {lightboxIndex + 1} / {gallery.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
