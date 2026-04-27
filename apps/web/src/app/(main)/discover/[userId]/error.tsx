"use client";

import { Button } from "@Poneglyph/ui/components/button";
import { IconAlertTriangle, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function VolunteerProfileError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/discover"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <IconArrowLeft className="w-4 h-4" />
        Back to Discover
      </Link>

      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-border bg-card">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
          <IconAlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Failed to load profile</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Something went wrong while fetching this volunteer profile. Please try again.
          </p>
        </div>
        <Button onClick={reset} variant="outline" size="sm">
          Try again
        </Button>
      </div>
    </div>
  );
}
