import { apiClient } from "@/lib/api-client";
import type { DatasetListItem, PaginatedResponse } from "@/lib/types";

interface DatasetsSidebarProps {
  limit?: number;
}

export async function DatasetsSidebar({ limit = 10 }: DatasetsSidebarProps) {
  const res = await apiClient.api.datasets.$get({ query: { limit: limit.toString() } });

  if (!res.ok) {
    return null;
  }

  const { data: datasets } = (await res.json()) as PaginatedResponse<DatasetListItem>;
  return datasets;
}
