import type { Metadata } from "next";
import { Share2 } from "lucide-react";
import { fetchExploreItems } from "@/api/users/explore.api";
import { PageHero } from "@/components/site/PageHero";
import { toItineraryPlace } from "@/lib/explore";
import { decodeSharedTrip } from "@/features/itineraries/planner/logic";
import { SharedTrip } from "@/features/itineraries/planner/SharedTrip";
import type { ItineraryItem } from "@/features/itineraries/types";

export const metadata: Metadata = {
  title: "Shared trip — The Marco Passport",
  robots: { index: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** /passport/shared?t=… — a read-only trip from a "Share trip" link. */
export default async function SharedTripPage({ searchParams }: { searchParams: SearchParams }) {
  const { t } = await searchParams;
  const trip = decodeSharedTrip(Array.isArray(t) ? t[0] : t);

  let items: ItineraryItem[] = [];
  let failed = false;
  if (trip) {
    try {
      const { items: listings } = await fetchExploreItems();
      const byId = new Map(listings.map((l) => [l.id, l]));
      items = trip.stops.flatMap((stop) => {
        const listing = byId.get(stop.id);
        return listing ? [{ place_id: stop.id, visit_date: stop.date, place: toItineraryPlace(listing) }] : [];
      });
    } catch {
      failed = true;
    }
  }

  return (
    <>
      <PageHero
        image="/assets/place-sunset.jpg"
        imageAlt="Sunset over a Marco Island pier"
        icon={Share2}
        eyebrow="Shared trip"
        title={trip?.name ?? "Shared trip"}
        size="compact"
      />
      <section className="bg-background py-12 md:py-16">
        <div className="site-container">
          {!trip ? (
            <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">
              This share link isn&apos;t valid. Ask whoever sent it for a new one.
            </p>
          ) : failed ? (
            <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">
              We couldn&apos;t load this trip right now. Please refresh to try again.
            </p>
          ) : (
            <SharedTrip
              name={trip.name}
              startDate={trip.start_date}
              endDate={trip.end_date}
              items={items}
              missing={trip.stops.length - items.length}
            />
          )}
        </div>
      </section>
    </>
  );
}
