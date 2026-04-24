import { apiClient } from "@/lib/api-client";
import type { VolunteerListItem, PaginatedResponse } from "@/lib/types";
import { VolunteerCard } from "./volunteer-card";
import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@Poneglyph/ui/components/button";

interface VolunteerGridProps {
  city?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

export async function VolunteerGrid({ city, tags, page = 1, limit = 20 }: VolunteerGridProps) {
  const query: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };
  if (city) query.city = city;
  if (tags) query.tags = tags;

  const res = await apiClient.api.discover.volunteers.$get({ query });

  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold text-foreground">Error loading volunteers</h3>
        <p className="text-sm text-muted-foreground mt-2">Please try again later.</p>
      </div>
    );
  }

  const {
    data: volunteers,
    total,
    page: currentPage,
    totalPages,
  } = (await res.json()) as PaginatedResponse<VolunteerListItem>;

  if (volunteers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-card">
        <h3 className="text-lg font-semibold text-foreground">No volunteers found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters to find who you're looking for.
        </p>
      </div>
    );
  }

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (tags) params.set("tags", tags);
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());
    return `/discover?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{volunteers.length}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> volunteers
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map((volunteer) => (
          <VolunteerCard key={volunteer.userId} volunteer={volunteer} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Link
            href={currentPage <= 1 ? "#" : createPageUrl(currentPage - 1)}
            aria-label="Previous page"
            className={currentPage <= 1 ? "pointer-events-none" : ""}
            tabIndex={currentPage <= 1 ? -1 : undefined}
          >
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              className={currentPage <= 1 ? "opacity-50" : ""}
            >
              <IconChevronLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-foreground">Page {currentPage}</span>
            <span className="text-sm text-muted-foreground">of {totalPages}</span>
          </div>

          <Link
            href={currentPage >= totalPages ? "#" : createPageUrl(currentPage + 1)}
            aria-label="Next page"
            className={currentPage >= totalPages ? "pointer-events-none" : ""}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
          >
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              className={currentPage >= totalPages ? "opacity-50" : ""}
            >
              <IconChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
