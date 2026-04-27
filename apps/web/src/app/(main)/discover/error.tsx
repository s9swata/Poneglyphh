"use client";

import { Button } from "@Poneglyph/ui/components/button";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function DiscoverError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Discover Volunteers</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-border bg-card">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
          <IconAlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Failed to load volunteers</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Something went wrong while fetching volunteers. Please try again.
          </p>
        </div>
        <Button onClick={reset} variant="outline" size="sm">
          Try again
        </Button>
      </div>
    </div>
  );
}
