"use client";

import { Button } from "@/components/ui/button";

export default function BlogDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-5 lg:px-8 py-32 text-center">
      <h1 className="font-display text-3xl text-primary">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-3">{error.message}</p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
