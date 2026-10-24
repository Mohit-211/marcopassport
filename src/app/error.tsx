"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="site-container flex min-h-screen items-center justify-center py-32">
      <div className="max-w-md text-center">
        <p className="eyebrow text-gold">Something went wrong</p>
        <h1 className="mt-3 text-4xl font-semibold text-primary">This page didn&apos;t load</h1>
        <p className="mt-3 text-muted-foreground">Something went wrong on our end.</p>
        <Button variant="gold" size="lg" className="mt-8" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
