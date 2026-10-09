"use client";

import Link from "next/link";
import { Clock, ExternalLink, Globe, MapPin, Phone, Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { itemHref } from "../normalize";
import type { NormalizedItem } from "../types";
import { AddToTripButton } from "./AddToTripButton";
import { SourceBadge } from "./SourceBadge";

/** Keyless Google Maps embed: exact pin from coordinates, else an address search */
function googleMapEmbedSrc(item: NormalizedItem) {
  const query =
    item.lat !== null && item.lng !== null ? `${item.lat},${item.lng}` : item.address || null;
  return query ? `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed` : null;
}

/** Item info card: a bottom sheet on phones, a side panel on larger screens. */
export function ItemDetailSheet({
  item,
  onClose,
}: {
  item: NormalizedItem | null;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  const href = item ? itemHref(item) : null;
  const mapSrc = item ? googleMapEmbedSrc(item) : null;

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "max-h-[85vh] overflow-y-auto rounded-t-3xl" : "w-full overflow-y-auto sm:max-w-md"}
      >
        {item && (
          <>
            <div className="relative h-48 shrink-0 bg-muted sm:h-56">
              <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <SheetHeader className="gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <SourceBadge source={item.source} />
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EBBD00]">
                  {item.category}
                </span>
              </div>
              <SheetTitle className="font-display text-2xl font-semibold text-[#002E50]">{item.name}</SheetTitle>
              {item.description && (
                <SheetDescription className="line-clamp-4">{item.description}</SheetDescription>
              )}
            </SheetHeader>

            <dl className="space-y-2.5 px-4 text-sm">
              {item.rating !== null && (
                <Row icon={<Star className="h-4 w-4 fill-gold text-gold" />}>{item.rating.toFixed(1)} rating</Row>
              )}
              {item.address && <Row icon={<MapPin className="h-4 w-4" />}>{item.address}</Row>}
              {item.openingHours && <Row icon={<Clock className="h-4 w-4" />}>{item.openingHours}</Row>}
              {item.phone && (
                <Row icon={<Phone className="h-4 w-4" />}>
                  <a href={`tel:${item.phone}`} className="hover:underline">{item.phone}</a>
                </Row>
              )}
              {item.website && (
                <Row icon={<Globe className="h-4 w-4" />}>
                  <a href={item.website} target="_blank" rel="noreferrer" className="break-all hover:underline">
                    {item.website.replace(/^https?:\/\//, "")}
                  </a>
                </Row>
              )}
            </dl>

            {mapSrc && (
              <iframe
                key={item.id}
                src={mapSrc}
                title={`Google map showing ${item.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="mx-4 mt-4 h-56 w-[calc(100%-2rem)] shrink-0 rounded-2xl border border-border sm:h-64"
              />
            )}

            <div className="mt-auto flex flex-wrap items-center gap-3 p-4">
              <AddToTripButton item={item} />
              {href && (
                <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  Full details <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-[#002E50]">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
