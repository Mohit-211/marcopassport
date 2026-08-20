"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowUpRight,
  CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Share2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Place } from "@/data/places";
import { cn } from "@/lib/utils";
import { AddToPassportModal } from "@/components/passport/AddToPassportModal";
import PlaceStoryContent from "@/components/places/PlaceStoryContent";
import NearbyAndRelated from "@/components/places/NearbyAndRelated";

export default function PlaceExperience({
  place,
  nearby,
}: {
  place: Place;
  nearby: Place[];
  // related: (typeof blogPosts)[number][];
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [planOpen, setPlanOpen] = useState(false);

  // TODO: replace with real passport store's hasItem(place.id) once a backend/store exists
  const [saved, setSaved] = useState(false);

  const handleSave = () => setPlanOpen(true);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: place.tagline,
          url: window.location.href,
        });
      } catch {
        /* dismissed */
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const nextImg = () =>
    setLightbox((i) => (i === null ? 0 : (i + 1) % place.gallery.length));
  const prevImg = () =>
    setLightbox((i) =>
      i === null ? 0 : (i - 1 + place.gallery.length) % place.gallery.length
    );

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={place.image}
            alt={place.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.22_0.06_240/0.45),oklch(0.22_0.06_240/0.3)_40%,oklch(0.22_0.06_240/0.92))]" />
        </div>
        <div className="container mx-auto px-5 lg:px-8 pt-32 pb-28 md:pt-44 md:pb-40 text-primary-foreground">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary-foreground/80 hover:text-gold transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> All places
          </Link>
          <div className="max-w-3xl mt-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-gold">
              <MapPin className="h-3.5 w-3.5" /> {place.tag} · Marco Island
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.05] text-balance">
              {place.name}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl">
              {place.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                variant="gold"
                size="lg"
                onClick={() => setPlanOpen(true)}
              >
                <CalendarIcon className="h-4 w-4" /> Add to Passport
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                Gallery
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mt-1">
                {place.gallery.length} moments
              </h2>
            </div>
            <p className="hidden md:block text-sm text-muted-foreground">
              Tap any image to expand
            </p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {place.gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className={cn(
                  "group relative shrink-0 snap-start overflow-hidden rounded-3xl shadow-soft hover:shadow-elegant transition-all duration-500",
                  i === 0
                    ? "w-[80vw] md:w-[640px] aspect-[16/10]"
                    : "w-[60vw] md:w-[400px] aspect-[4/5]"
                )}
              >
                <img
                  src={src}
                  alt={`${place.name} — view ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors" />
                <span className="absolute bottom-4 right-4 inline-flex items-center justify-center h-9 w-9 rounded-full bg-background/90 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-5 lg:px-8 pb-16 md:pb-24 grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">
        <PlaceStoryContent place={place} />

        {/* Sticky plan-your-visit (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
              <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                Plan your visit
              </p>
              <h3 className="font-display text-2xl font-semibold mt-2">
                Save this to your Passport
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Pick a date and we'll weave it into your itinerary.
              </p>

              <Button
                variant="outline"
                className="mt-5 w-full justify-start text-muted-foreground"
                onClick={() => setPlanOpen(true)}
              >
                <CalendarIcon className="h-4 w-4" />
                {saved ? "Edit your visit date" : "Pick a visit date"}
              </Button>

              <Button
                variant={saved ? "outline" : "gold"}
                size="lg"
                className="w-full mt-3"
                onClick={handleSave}
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" /> Saved to Passport
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" /> Add to Passport
                  </>
                )}
              </Button>

              <button
                onClick={handleShare}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" /> Share this place
              </button>
            </div>

            <div className="rounded-3xl bg-sand p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                Quick facts
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Best time</dt>
                  <dd className="font-medium text-right">
                    {place.expectations[0]?.label}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Vibe</dt>
                  <dd className="font-medium text-right">{place.tag}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Cost</dt>
                  <dd className="font-medium text-right">{place.info.fee}</dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </section>

      <NearbyAndRelated nearby={nearby} related={related} />

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border px-4 py-3 flex items-center gap-3 shadow-elegant">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {place.tag}
          </p>
          <p className="font-display text-base font-semibold truncate">
            {place.name}
          </p>
        </div>
        <Button
          variant={saved ? "outline" : "gold"}
          size="sm"
          onClick={() => setPlanOpen(true)}
        >
          {saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
          {saved ? "Saved" : "Add"}
        </Button>
      </div>
      <div className="lg:hidden h-20" aria-hidden />

      {/* Add to Passport modal */}
      <AddToPassportModal
        open={planOpen}
        onOpenChange={setPlanOpen}
        source={{
          refId: place.id,
          name: place.name,
          category: place.tag,
          image: place.gallery?.[0] ?? place.image,
          location: "Marco Island",
        }}
      />

      {/* Lightbox */}
      <Dialog
        open={lightbox !== null}
        onOpenChange={(o) => !o && setLightbox(null)}
      >
        <DialogContent className="max-w-6xl bg-primary border-none p-0 overflow-hidden">
          {lightbox !== null && (
            <div className="relative">
              <img
                src={place.gallery[lightbox]}
                alt={`${place.name} — view ${lightbox + 1}`}
                className="w-full max-h-[85vh] object-contain bg-primary"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 grid place-items-center h-10 w-10 rounded-full bg-background/90 text-foreground hover:bg-background"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={prevImg}
                className="absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center h-12 w-12 rounded-full bg-background/90 text-foreground hover:bg-background"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center h-12 w-12 rounded-full bg-background/90 text-foreground hover:bg-background"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 text-foreground text-xs uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
                {lightbox + 1} / {place.gallery.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
