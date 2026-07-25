"use client";

import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type PassportItem = {
  id: string;
  refId: string;
  name: string;
  category: string;
  image: string;
  location?: string;
  date?: string;
  time?: string;
};

interface PassportItemCardProps {
  item: PassportItem;
  onEdit: (item: PassportItem) => void;
  onRemove: (item: PassportItem) => void;
}

export function PassportItemCard({
  item,
  onEdit,
  onRemove,
}: PassportItemCardProps) {
  return (
    <li className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-48 sm:h-auto shrink-0 relative overflow-hidden bg-muted">
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1 p-5 sm:p-6 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#EBBD00] font-semibold">
                {item.category}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-[#002E50]">
                {item.name}
              </h3>
              {item.location && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.location}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002E50]/5 px-3 py-1 text-xs font-medium text-[#002E50]">
              <CalendarIcon className="h-3.5 w-3.5" />
              {item.date
                ? format(new Date(item.date), "EEE, MMM d")
                : "No date set"}
            </span>
            {item.time && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBBD00]/15 px-3 py-1 text-xs font-medium text-[#002E50]">
                <Clock className="h-3.5 w-3.5" />
                {item.time}
              </span>
            )}
          </div>

          <div className="mt-5 sm:mt-auto flex items-center gap-2 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
              className="rounded-xl"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item)}
              className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
