"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActiveChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition"
    >
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}

export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border p-16 text-center bg-sand/40">
      <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-gold/15 text-gold mb-4">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="font-display text-2xl font-semibold">
        No listings match those filters
      </h3>
      <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">
        Try clearing a filter or expanding your search — there's still plenty
        more to discover.
      </p>
      <Button variant="gold" className="mt-6" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  );
}
