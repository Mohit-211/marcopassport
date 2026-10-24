import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Shown with a 404 when the blog doesn't exist. */
export default function BlogNotFound() {
  return (
    <div className="site-container py-32 text-center">
      <h1 className="font-display text-4xl text-primary">
        Blog not found
      </h1>
      <p className="text-muted-foreground mt-3">
        The article you&apos;re looking for may have been moved.
      </p>
      <Link href="/blog" className="inline-block mt-6">
        <Button className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90">
          Back to the blog
        </Button>
      </Link>
    </div>
  );
}
