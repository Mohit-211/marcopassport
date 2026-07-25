import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PassportEmptyState() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-10 sm:p-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#002E50] text-[#EBBD00] mb-5">
        <Compass className="h-7 w-7" />
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#002E50]">
        Your Passport is empty
      </h2>
      <p className="mt-3 text-muted-foreground max-w-md mx-auto">
        Start exploring Marco Island and save the places you'd love to visit.
        Add dates and times to plan your perfect trip.
      </p>
      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/explore">
          <Button variant="gold" size="lg">
            <Compass className="h-4 w-4" /> Explore Places
          </Button>
        </Link>
        <Link href="/places">
          <Button variant="outline" size="lg">
            Browse Featured
          </Button>
        </Link>
      </div>
    </div>
  );
}
