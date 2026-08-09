"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ActiveChip({
  label,
  action,
}: {
  label: string;
  action: () => void;
}) {
  return (
    <button
      type="button"
      onClick={action}
      className="
        inline-flex items-center gap-1.5
        rounded-full
        bg-primary
        py-1 pl-3 pr-2
        text-xs font-medium
        text-primary-foreground
        transition
        hover:bg-primary/90
      "
    >
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}

export function EmptyState({ clearAction }: { clearAction: () => void }) {
  return (
    <div
      className="
        rounded-3xl
        border border-dashed border-border
        bg-sand/40
        p-16
        text-center
      "
    >
      <div
        className="
          mx-auto mb-4
          grid h-14 w-14 place-items-center
          rounded-full
          bg-gold/15
          text-gold
        "
      >
        <Search className="h-6 w-6" />
      </div>

      <h3 className="font-display text-2xl font-semibold">
        No listings match those filters
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Try clearing a filter or expanding your search. There is still plenty
        more to discover.
      </p>

      <Button variant="gold" className="mt-6" onClick={clearAction}>
        Clear all filters
      </Button>
    </div>
  );
}
