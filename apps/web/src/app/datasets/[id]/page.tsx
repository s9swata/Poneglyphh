import { notFound } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type { DatasetDetail } from "@/lib/types";
import { DatasetDetailHeader } from "./_components/dataset-detail-header";
import { DatasetAttachments } from "./_components/dataset-attachments";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DatasetDetailPage(props: Props) {
  const { id } = await props.params;

  const res = await apiClient.api.datasets[":id"].$get({ param: { id } });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to load dataset");
  }

  const dataset = (await res.json()) as DatasetDetail;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <DatasetDetailHeader dataset={dataset} />
      <div className="mt-8">
        <DatasetAttachments datasetId={dataset.id} attachments={dataset.attachments} />
      </div>
    </div>
  );
}
