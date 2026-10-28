import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Shown with a 404 for an unknown issue, or a draft that isn't published. */
export default function MagazineIssueNotFound() {
  return (
    <div className="site-container py-32 text-center">
      <h1 className="text-4xl font-semibold text-primary">Issue not found</h1>
      <p className="mt-3 text-muted-foreground">It may not be published yet, or it has moved.</p>
      <Button variant="gold" className="mt-6" nativeButton={false} render={<Link href="/magazine" />}>
        Back to the magazine
      </Button>
    </div>
  );
}
