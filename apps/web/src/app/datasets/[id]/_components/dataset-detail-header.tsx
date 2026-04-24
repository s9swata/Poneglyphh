import Link from "next/link";
import { Badge } from "@Poneglyph/ui/components/badge";
import { Separator } from "@Poneglyph/ui/components/separator";
import {
  IconShieldCheck,
  IconEye,
  IconDownload,
  IconCalendar,
  IconLanguage,
  IconDatabase,
} from "@tabler/icons-react";
import type { DatasetDetail } from "@/lib/types";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  approved: "default",
  pending: "outline",
  rejected: "destructive",
  archived: "secondary",
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface Props {
  dataset: DatasetDetail;
}

export function DatasetDetailHeader({ dataset }: Props) {
  const statusVariant = STATUS_VARIANT[dataset.status] ?? "outline";

  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/datasets" className="hover:text-foreground transition-colors">
          Datasets
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[240px]">{dataset.title}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariant} className="capitalize">
          {dataset.status}
        </Badge>
        {dataset.isVerified && (
          <Badge variant="default" className="gap-1">
            <IconShieldCheck className="size-3" />
            Verified
          </Badge>
        )}
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-foreground">{dataset.title}</h1>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {dataset.publisher && (
          <span className="font-medium text-foreground">{dataset.publisher}</span>
        )}
        {dataset.publicationDate && (
          <span className="flex items-center gap-1">
            <IconCalendar className="size-3.5" />
            {formatDate(dataset.publicationDate)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <IconLanguage className="size-3.5" />
          {dataset.language}
        </span>
        <span className="flex items-center gap-1">
          <IconEye className="size-3.5" />
          {dataset.viewCount.toLocaleString()} views
        </span>
        <span className="flex items-center gap-1">
          <IconDownload className="size-3.5" />
          {dataset.downloadCount.toLocaleString()} downloads
        </span>
      </div>

      <Separator />

      {dataset.description && (
        <p className="text-base text-muted-foreground leading-relaxed">{dataset.description}</p>
      )}

      {dataset.summary && (
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Summary
          </p>
          <p className="text-sm text-foreground leading-relaxed">{dataset.summary}</p>
        </div>
      )}

      {dataset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {dataset.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <IconDatabase className="size-3.5" />
          <span className="font-medium text-foreground">{dataset.sourceName}</span>
          <span className="capitalize">({dataset.sourceType})</span>
        </span>
        <span className="text-xs text-muted-foreground">
          Added {formatDate(dataset.createdAt)}
        </span>
      </div>
    </div>
  );
}
