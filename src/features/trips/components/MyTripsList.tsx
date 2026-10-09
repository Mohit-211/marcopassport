"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ArrowRight, CalendarDays, Compass, MapPin, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { tripDayCount, tripLocation } from "../trip-logic";
import { useTrips } from "../TripsProvider";
import type { TripWithItems } from "../types";
import { TripsHero } from "./TripsHero";

export function formatRange(start: string, end: string) {
  if (!start || !end) return "No dates";
  return `${format(parseISO(start), "MMM d")} – ${format(parseISO(end), "MMM d, yyyy")}`;
}

export function MyTripsList() {
  const { trips, loading, error, reload, openCreateTrip, isAuthenticated } = useTrips();
  const sorted = [...trips].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const savedCount = trips.reduce((n, t) => n + t.items.length, 0);

  return (
    <>
      <TripsHero
        eyebrow="Your journeys"
        eyebrowIcon={<Sparkles className="h-3.5 w-3.5" />}
        title={
          <>
            My <span className="italic text-gold">Trips</span>
          </>
        }
        description={
          isAuthenticated ? (
            "Every getaway you're planning on Marco Island, with the places and businesses you've saved for each day."
          ) : (
            <>
              Trips are saved on this device.{" "}
              <Link href="/auth" className="font-medium text-gold underline underline-offset-4">
                Sign in
              </Link>{" "}
              to keep them in your account.
            </>
          )
        }
        actions={
          <>
            <Button variant="gold" size="lg" onClick={() => openCreateTrip()}>
              <Plus className="h-4 w-4" /> Create New Trip
            </Button>
            <Link href="/passport">
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <Compass className="h-4 w-4" /> Explore Passport
              </Button>
            </Link>
          </>
        }
      >
        {!loading && trips.length > 0 && (
          <dl className="mt-8 flex gap-8 border-t border-primary-foreground/15 pt-6">
            <Stat label="Trips" value={trips.length} />
            <Stat label="Saved stops" value={savedCount} />
          </dl>
        )}
      </TripsHero>

      <section className="bg-cream py-14 md:py-20">
        <div className="site-container max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EBBD00]">Itineraries</p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#002E50] md:text-4xl">
            Upcoming adventures
          </h2>

          <div className="mt-10">
            {loading ? (
              <ul className="grid gap-6 md:grid-cols-2" aria-busy="true" aria-label="Loading trips">
                {[0, 1].map((i) => (
                  <li key={i} className="overflow-hidden rounded-3xl bg-card shadow-sm">
                    <Skeleton className="h-40 rounded-none" />
                    <div className="space-y-3 p-6">
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : error ? (
              <div className="rounded-3xl bg-card p-10 text-center shadow-sm">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" className="mt-5" onClick={reload}>
                  Try again
                </Button>
              </div>
            ) : sorted.length === 0 ? (
              <EmptyTrips onCreate={() => openCreateTrip()} />
            ) : (
              <ul className="grid gap-6 md:grid-cols-2">
                {sorted.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="mt-1 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/60">{label}</dt>
      <dd className="font-display text-3xl font-medium text-gold">{value}</dd>
    </div>
  );
}

function TripCard({ trip }: { trip: TripWithItems }) {
  const days = tripDayCount(trip);
  const covers = trip.items.slice(0, 3).map((i) => i.normalizedSnapshot.image);

  return (
    <li>
      <Link
        href={`/my-trips/${trip.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-[#002E50]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="relative h-44 overflow-hidden bg-[#002E50]">
          {covers.length > 0 ? (
            <div className="grid h-full gap-0.5" style={{ gridTemplateColumns: `repeat(${covers.length}, 1fr)` }}>
              {covers.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ))}
            </div>
          ) : (
            <div className="grid h-full place-items-center text-[#EBBD00]/70">
              <MapPin className="h-10 w-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#002E50]/80 via-[#002E50]/10 to-transparent" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#EBBD00] px-3 py-1 text-xs font-semibold text-[#002E50] shadow">
            <CalendarDays className="h-3.5 w-3.5" /> {days} day{days === 1 ? "" : "s"}
          </span>
          <h3 className="absolute inset-x-4 bottom-3 truncate font-display text-2xl font-semibold text-white">
            {trip.name}
          </h3>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="space-y-1.5 text-sm font-medium text-[#002E50]">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-[#EBBD00]" /> <span className="truncate">{tripLocation(trip)}</span>
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-[#EBBD00]" /> {formatRange(trip.startDate, trip.endDate)}
            </p>
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
            <span>
              <strong className="font-semibold text-[#002E50]">{trip.items.length}</strong> saved
              <span className="mx-2" aria-hidden>·</span>
              Created {format(parseISO(trip.createdAt), "MMM d, yyyy")}
            </span>
            <ArrowRight className="h-4 w-4 text-[#002E50] transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </li>
  );
}

function EmptyTrips({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-[#002E50]/15 bg-card/60 p-10 text-center sm:p-16">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#002E50] text-[#EBBD00]">
        <Compass className="h-7 w-7" />
      </div>
      <h3 className="font-display text-2xl font-semibold text-[#002E50] sm:text-3xl">No trips yet</h3>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        Explore the Passport and add places to your trip.
      </p>
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/passport">
          <Button variant="gold" size="lg">
            <Compass className="h-4 w-4" /> Explore Passport
          </Button>
        </Link>
        <Button variant="outline" size="lg" onClick={onCreate}>
          <Plus className="h-4 w-4" /> Create a Trip
        </Button>
      </div>
    </div>
  );
}
