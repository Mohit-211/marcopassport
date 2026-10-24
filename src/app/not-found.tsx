import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="site-container flex min-h-screen items-center justify-center py-32">
      <div className="max-w-md text-center">
        <p className="eyebrow text-gold">Error 404</p>
        <h1 className="mt-3 text-4xl font-semibold text-primary md:text-5xl">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button variant="gold" size="lg" className="mt-8" nativeButton={false} render={<Link href="/" />}>
          Go home
        </Button>
      </div>
    </div>
  );
}
