"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({ clearAction }: { clearAction: () => void }) {
  return (
    <div className="rounded-card border border-dashed border-border bg-card p-16 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold">
        <Search className="h-6 w-6" />
      </div>

      <h3 className="text-2xl font-semibold text-primary">Nothing matches that yet</h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Try another category or a different search. There is still plenty more to discover.
      </p>

      <Button variant="gold" className="mt-6" onClick={clearAction}>
        Show everything
      </Button>
    </div>
  );
}
