"use client";

import { useEffect, useState } from "react";
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
import { mapPlaceToCard, type PlaceCard, type PlaceDetail } from "@/lib/place";
import { cn } from "@/lib/utils";
import { AddToPassportModal } from "@/components/passport/AddToPassportModal";
import { LoginRequiredModal } from "@/components/auth/LoginRequiredModal";
import PlaceStoryContent from "@/components/places/PlaceStoryContent";
import NearbyAndRelated from "@/components/places/NearbyAndRelated";
import { getAuthToken } from "@/lib/auth";
import { GetRelatesPlaceByCategoryId } from "@/api/users/places.api";

export default function PlaceExperience({
  place,

}: {
  place: PlaceDetail;
  
}) {

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  console.log(place,"placeplaceplaceplace")
  const [saved, setSaved] = useState(place.isInPassport);

  // The detail page is server-rendered, so the initial fetch runs without
  // the user's token (it lives in localStorage) and is_in_passport always
  // comes back false. Re-check it here now that we're on the client.


  // Returning here from the sign-in prompt (see LoginRequiredModal) — pick

  // Returning here from the sign-in prompt (see LoginRequiredModal) — pick
  // straight back up where the user left off and open the passport modal.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("openPassport") !== "1" || !getAuthToken()) return;

    setPlanOpen(true);
    params.delete("openPassport");
    const newSearch = params.toString();
    window.history.replaceState(
      {},
      "",
      window.location.pathname + (newSearch ? `?${newSearch}` : "")
    );
  }, []);

  const openPlanModal = () => {
    if (!getAuthToken()) {
      setLoginPromptOpen(true);
      return;
    }
    setPlanOpen(true);
  };

  const handleSave = () => openPlanModal();

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: place.blurb,
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
    console.log(saved,"saved")
  return (
    <>
      {/* Hero */}


    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground pt-10">
  <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Content */}
      <div>
        {/* Eyebrow */}
        <Link
          href="/places"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary-foreground/80 hover:text-gold transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> All places
        </Link>

        <div className="mt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-gold">
            <MapPin className="h-3.5 w-3.5" /> {place.tag} · Marco Island
          </div>

          <h1 className="mt-6 font-display text-[clamp(1.6rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
            {place.name}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl">
            {place.blurb}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {!saved && (
              <Button variant="gold" size="lg" onClick={openPlanModal}>
                <CalendarIcon className="h-4 w-4" /> Add to Passport
              </Button>
            )}
            
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

      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
        <img
          src={place.image}
          alt={place.name}
          className="absolute inset-0 h-full w-full object-cover object-center"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
      </div>
    </div>
  </div>
</section>

      {/* Gallery */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
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
                    : "w-[60vw] md:w-[400px] aspect-[5/4]"
                )}
              >
                <img
                  src={src}
                  alt={`${place.name} — view ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 aspect-[16/9]"
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
      <section className="container mx-auto max-w-7xl px-5 pb-16 md:pb-24 grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">
        <PlaceStoryContent place={place} />

        {/* Sticky plan-your-visit (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
              <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                Plan your visit
              </p>
              <h3 className="font-display text-2xl font-semibold mt-2">
                {saved ? "Saved to your Passport" : "Save this to your Passport"}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {saved
                  ? "You're all set — manage the visit date from your Passport."
                  : "Pick a date and we'll weave it into your itinerary."}
              </p>

              {!saved && (
                <Button
                  variant="outline"
                  className="mt-5 w-full justify-start text-muted-foreground"
                  onClick={openPlanModal}
                >
                  <CalendarIcon className="h-4 w-4" />
                  Pick a visit date
                </Button>
              )}

              {saved ? (
                <Link href="/passport" className="mt-3 block">
                  <Button variant="outline" size="lg" className="w-full">
                    <Check className="h-4 w-4" /> Saved to Passport
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full mt-3"
                  onClick={handleSave}
                >
                  <Heart className="h-4 w-4" /> Add to Passport
                </Button>
              )}

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
                    {place.bestTimeToVisit ?? "Anytime"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Vibe</dt>
                  <dd className="font-medium text-right">{place.tag}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Cost</dt>
                  <dd className="font-medium text-right">
                    {place.fees ?? place.priceLevel ?? "Free"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </section>

      <NearbyAndRelated
        categoriesId={place?.categories?.[0]?.id}
        currentSlug={place.slug}
      />

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
        {saved ? (
          <Link href="/passport">
            <Button variant="outline" size="sm">
              <Check className="h-4 w-4" />
              Saved
            </Button>
          </Link>
        ) : (
          <Button variant="gold" size="sm" onClick={openPlanModal}>
            <Heart className="h-4 w-4" />
            Add
          </Button>
        )}
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
        onSaved={() => setSaved(true)}
      />

      {/* Sign-in prompt */}
      <LoginRequiredModal open={loginPromptOpen} onOpenChange={setLoginPromptOpen} />

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
