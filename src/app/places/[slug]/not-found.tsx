import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Shown with a 404 when the place doesn't exist. */
export default function PlaceNotFound() {
  return (
    <div className="site-container py-32 text-center">
      <h1 className="font-display text-4xl font-semibold">Place not found</h1>
      <p className="text-muted-foreground mt-3">
        It may have moved or been removed.
      </p>
      <Link href="/explore?type=place" className="inline-block mt-6">
        <Button variant="gold">Back to Explore</Button>
      </Link>
    </div>
  );
}
