import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Shown with a 404 when no place has this slug. */
export default function ExplorePlaceNotFound() {
  return (
    <div className="site-container py-32 text-center">
      <h1 className="text-4xl font-semibold text-primary">Place not found</h1>
      <p className="mt-3 text-muted-foreground">It may have moved or been removed.</p>
      <Button variant="gold" className="mt-6" nativeButton={false} render={<Link href="/explore" />}>
        Back to Explore
      </Button>
    </div>
  );
}
