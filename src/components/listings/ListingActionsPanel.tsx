"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Star,
  Globe,
  Heart,
  Check,
  CalendarIcon,
  ArrowRight,
  Sparkles,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type ListingActionsPanelProps = {
  listing: {
    price: string;
    category: string;
    location: string;
    rating: number;
  };
  categoryMeta?: { name: string };
};

export default function ListingActionsPanel({
  listing,
  categoryMeta,
}: ListingActionsPanelProps) {
  const [saved, setSaved] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  // TODO: wire up to real passport store once backend/store is available
  const handleSave = () => {
    setSaved(true);
    toast.success("Added to your Passport", {
      description: date
        ? `Saved for ${format(date, "PPP")}`
        : "Saved for later",
    });
  };

  return (
    <>
      {/* Sticky action panel */}
      <aside>
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                {categoryMeta?.name ?? listing.category}
              </span>
              <span className="text-sm font-semibold text-gold">
                {listing.price}
              </span>
            </div>
            <p className="font-display text-2xl font-semibold mt-3 leading-tight">
              Plan your visit
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Save this place to your Passport and pick a date.
            </p>

            <Popover>
              <PopoverTrigger
                className={cn(
                  "mt-5 w-full flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm hover:border-primary transition",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4 text-gold" />
                {date ? format(date, "PPP") : "Pick a date for your visit"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) =>
                    d < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  autoFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Button variant="gold" size="lg" className="w-full mt-3">
              <Globe className="h-4 w-4" /> Visit website
            </Button>
            <Button
              variant={saved ? "default" : "outline"}
              size="lg"
              className={cn("w-full mt-2 transition", saved && "bg-primary")}
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

            <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="uppercase tracking-wider text-muted-foreground font-semibold">
                  Rating
                </p>
                <p className="mt-1 inline-flex items-center gap-1 font-display text-lg font-semibold text-foreground">
                  <Star className="h-4 w-4 fill-gold text-gold" />{" "}
                  {listing.rating.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="uppercase tracking-wider text-muted-foreground font-semibold">
                  Area
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-foreground truncate">
                  {listing.location}
                </p>
              </div>
            </div>

            <button className="mt-5 w-full inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-primary transition">
              <Share2 className="h-3.5 w-3.5" /> Share this listing
            </button>
          </div>

          <div className="rounded-3xl bg-primary text-primary-foreground p-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Concierge
            </div>
            <p className="font-display text-xl font-semibold mt-2 leading-tight">
              Need help planning?
            </p>
            <p className="text-sm text-primary-foreground/80 mt-2">
              Our island concierge can tailor your itinerary and lock in
              hard-to-get reservations.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 mt-4 text-gold font-semibold text-sm story-link"
            >
              Message concierge <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile sticky action bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border px-4 py-3 flex gap-2 shadow-elegant">
        <Button
          variant={saved ? "default" : "outline"}
          className="flex-1"
          onClick={handleSave}
        >
          {saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
          {saved ? "Saved" : "Passport"}
        </Button>
        <Button variant="gold" className="flex-1">
          <Globe className="h-4 w-4" /> Visit
        </Button>
      </div>
    </>
  );
}
