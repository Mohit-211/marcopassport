"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  ParkingCircle,
  Phone,
  Share2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HeroMeta, PageHero } from "@/components/site/PageHero";
import { LocationCard } from "@/components/site/LocationCard";
import { RatingBadge } from "@/components/explore/ExploreCard";
import { SimilarListings } from "@/components/explore/SimilarListings";
import ReviewsSection from "@/components/listings/ReviewsSection";
import PlaceStoryContent, { SectionHeading } from "@/components/places/PlaceStoryContent";
import { AddToItineraryButton } from "@/features/itineraries/components/AddToItineraryButton";
import type { ItineraryPlace } from "@/features/itineraries/types";
import type { PlaceDetail } from "@/lib/place";
import { shareLink } from "@/lib/share";

const PHOTOS_SHOWN = 6;

/**
 * A place-to-visit page: hero, then the story on the left and one sticky
 * "Plan your visit" card on the right that holds every practical fact once.
 */
export default function PlaceExperience({ place }: { place: PlaceDetail }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const itineraryPlace: ItineraryPlace = {
    id: Number(place.id),
    type: "place",
    name: place.name,
    slug: place.slug,
    short_description: place.short_description,
    featured_image: place.image,
    address: place.address,
  };
  // The hero already shows the cover photo; the gallery only adds the rest.
  const photos = place.gallery.length > 1 ? place.gallery : [];

  const facts = [
    { icon: MapPin, label: "Address", value: place.address },
    { icon: Clock, label: "Hours", value: place.hours },
    { icon: CreditCard, label: "Cost", value: place.fees ?? place.priceLevel },
    { icon: ParkingCircle, label: "Parking", value: place.parking },
    { icon: CalendarDays, label: "Best time to visit", value: place.bestTimeToVisit },
  ].filter((f) => f.value);

  const share = () =>
    shareLink({
      title: place.name,
      text: place.blurb || undefined,
      url: `${window.location.origin}/places/${place.slug}`,
    });

  const step = (by: number) =>
    setLightbox((i) => (i === null ? 0 : (i + by + photos.length) % photos.length));

  return (
    <>
      <PageHero
        image={place.image}
        imageAlt={place.name}
        icon={MapPin}
        eyebrow={`${place.tag} · Marco Island`}
        title={place.name}
        description={place.blurb || undefined}
      >
        <div className="flex flex-wrap items-center gap-3">
          <AddToItineraryButton place={itineraryPlace} size="lg" />
          <Tooltip content="Share this place, or copy its link">
            <Button variant="ghostLight" size="lg" onClick={share}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </Tooltip>
        </div>
        {(place.rating !== null || place.neighborhood) && (
          <div className="mt-6">
            <HeroMeta
              items={[
                ...(place.rating !== null
                  ? [`★ ${place.rating.toFixed(1)}${place.reviewCount ? ` · ${place.reviewCount} reviews` : ""}`]
                  : []),
                ...(place.neighborhood ? [place.neighborhood] : []),
              ]}
            />
          </div>
        )}
      </PageHero>

      <nav aria-label="Breadcrumb" className="site-container pt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/explore?type=place" className="inline-flex items-center gap-1 hover:text-primary">
              <ChevronLeft className="h-3.5 w-3.5" /> Places to visit
            </Link>
          </li>
          <li aria-hidden className="opacity-40">/</li>
          <li className="truncate text-foreground">{place.name}</li>
        </ol>
      </nav>

      <section className="site-container grid gap-12 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        <div className="min-w-0 space-y-14">
          <PlaceStoryContent place={place} />

          {/* On phones the practical facts follow the story instead of a sidebar. */}
          {facts.length > 0 && (
            <section className="space-y-4 lg:hidden">
              <SectionHeading eyebrow="Plan your visit" title="Good to know" />
              <dl className="divide-y divide-border rounded-3xl border border-border bg-card px-5 text-sm">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3 py-4">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <div className="min-w-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
                      <dd className="mt-0.5 text-foreground">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {photos.length > 0 && (
            <section className="space-y-6">
              <SectionHeading eyebrow="Gallery" title="Photos" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.slice(0, PHOTOS_SHOWN).map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setLightbox(i)}
                    aria-label={`Open photo ${i + 1} of ${photos.length}`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {i === PHOTOS_SHOWN - 1 && photos.length > PHOTOS_SHOWN && (
                      <span className="absolute inset-0 grid place-items-center bg-primary/65 text-sm font-semibold text-primary-foreground">
                        +{photos.length - PHOTOS_SHOWN} more
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-6">
            <SectionHeading eyebrow="Getting there" title="Location" />
            <LocationCard name={place.name} address={place.address} />
          </section>

          <ReviewsSection id={place.id} />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Plan your visit</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-primary">{place.name}</h2>
            <RatingBadge rating={place.rating} reviewCount={place.reviewCount} className="mt-2" />
            <AddToItineraryButton place={itineraryPlace} size="lg" className="mt-5 w-full" />

            {facts.length > 0 && (
              <dl className="mt-6 space-y-4 border-t border-border pt-6 text-sm">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <div className="min-w-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
                      <dd className="mt-0.5 text-foreground">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}

            {(place.phone || place.email || place.websiteUrl) && (
              <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
                {place.phone && (
                  <Button variant="outline" size="sm" nativeButton={false} render={<a href={`tel:${place.phone}`} />}>
                    <Phone className="h-3.5 w-3.5" /> Call
                  </Button>
                )}
                {place.email && (
                  <Button variant="outline" size="sm" nativeButton={false} render={<a href={`mailto:${place.email}`} />}>
                    <Mail className="h-3.5 w-3.5" /> Email
                  </Button>
                )}
                {place.websiteUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<a href={place.websiteUrl} target="_blank" rel="noopener noreferrer" />}
                  >
                    <Globe className="h-3.5 w-3.5" /> Website
                  </Button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={share}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Share2 className="h-3.5 w-3.5" /> Share this place
            </button>
          </div>
        </aside>

      </section>

      <SimilarListings type="place" categoryId={place.categories?.[0]?.id} currentSlug={place.slug} />

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-background/95 px-4 py-3 shadow-elegant backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{place.tag}</p>
          <p className="truncate font-display text-base font-semibold text-primary">{place.name}</p>
        </div>
        <AddToItineraryButton place={itineraryPlace} size="sm" compactLabel />
      </div>
      <div className="h-20 lg:hidden" aria-hidden />

      <Dialog open={lightbox !== null} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent showCloseButton={false} className="max-w-6xl overflow-hidden border-none bg-primary p-0 sm:max-w-6xl">
          <DialogTitle className="sr-only">{place.name} photos</DialogTitle>
          {lightbox !== null && (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[lightbox]}
                alt={`${place.name}, photo ${lightbox + 1}`}
                className="max-h-[85vh] w-full bg-primary object-contain"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-foreground hover:bg-background"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => step(-1)}
                    className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground hover:bg-background"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => step(1)}
                    className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground hover:bg-background"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-foreground">
                {lightbox + 1} / {photos.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
