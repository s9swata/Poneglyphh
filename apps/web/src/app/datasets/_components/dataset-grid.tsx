import { apiClient } from "@/lib/api-client";
import type { DatasetListItem, PaginatedResponse } from "@/lib/types";
import { DatasetCard } from "./dataset-card";
import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@Poneglyph/ui/components/button";

interface DatasetGridProps {
  q?: string;
  status?: any;
  fileType?: any;
  tags?: string[];
  language?: string;
  page?: number;
  limit?: number;
  sortBy?: any;
  sortOrder?: any;
}

export async function DatasetGrid(props: DatasetGridProps) {
  // Construct the query object for the RPC client
  const query: Record<string, string | string[]> = {};

  if (props.q) query.q = props.q;
  if (props.status) query.status = props.status;
  if (props.fileType) query.fileType = props.fileType;
  if (props.language) query.language = props.language;
  if (props.sortBy) query.sortBy = props.sortBy;
  if (props.sortOrder) query.sortOrder = props.sortOrder;
  if (props.page) query.page = props.page.toString();
  if (props.limit) query.limit = props.limit.toString();
  if (props.tags && props.tags.length > 0) query.tags = props.tags;

  // Fetch data via typed RPC client
  const res = await apiClient.api.v1.datasets.$get({ query });

  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          Error loading datasets
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  const { data: datasets, total, page, totalPages } =
    (await res.json()) as PaginatedResponse<DatasetListItem>;

  if (datasets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-card">
        <h3 className="text-lg font-semibold text-foreground">
          No datasets found
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  // Create base URL for pagination links
  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (props.q) params.set("q", props.q);
    if (props.status) params.set("status", props.status);
    if (props.fileType) params.set("fileType", props.fileType);
    if (props.language) params.set("language", props.language);
    if (props.sortBy) params.set("sortBy", props.sortBy);
    if (props.sortOrder) params.set("sortOrder", props.sortOrder);
    if (props.tags) {
      props.tags.forEach((tag) => params.append("tags", tag));
    }
    params.set("page", newPage.toString());
    if (props.limit) params.set("limit", props.limit.toString());

    return `/datasets?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{datasets.length}</span>{" "}
          of <span className="font-medium text-foreground">{total}</span>{" "}
          datasets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((dataset) => (
          <DatasetCard key={dataset.id} dataset={dataset} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Link
            href={page <= 1 ? "#" : createPageUrl(page - 1)}
            aria-label="Previous page"
            className={page <= 1 ? "pointer-events-none" : ""}
            tabIndex={page <= 1 ? -1 : undefined}
          >
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              className={page <= 1 ? "opacity-50" : ""}
            >
              <IconChevronLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-foreground">
              Page {page}
            </span>
            <span className="text-sm text-muted-foreground">
              of {totalPages}
            </span>
          </div>

          <Link
            href={page >= totalPages ? "#" : createPageUrl(page + 1)}
            aria-label="Next page"
            className={page >= totalPages ? "pointer-events-none" : ""}
            tabIndex={page >= totalPages ? -1 : undefined}
          >
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              className={page >= totalPages ? "opacity-50" : ""}
            >
              <IconChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
