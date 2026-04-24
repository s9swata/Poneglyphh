import { Badge } from "@Poneglyph/ui/components/badge";
import { Button } from "@Poneglyph/ui/components/button";
import { IconDownload, IconEye, IconPaperclip } from "@tabler/icons-react";
import type { DatasetAttachment } from "@/lib/types";

interface Props {
  datasetId: string;
  attachments: DatasetAttachment[];
}

export function DatasetAttachments({ datasetId, attachments }: Props) {
  if (attachments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">No attachments available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <IconPaperclip className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">
          Attachments ({attachments.length})
        </h2>
      </div>

      <ul className="divide-y divide-border">
        {attachments.map((attachment) => {
          const fileBase = `/api/datasets/${datasetId}/files/${attachment.index}`;
          return (
            <li
              key={attachment.index}
              className="flex items-center justify-between px-5 py-3.5 gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Badge variant="outline" className="uppercase text-[10px] font-bold shrink-0">
                  {attachment.fileType}
                </Badge>
                <span className="text-sm text-muted-foreground truncate">
                  File {attachment.index + 1}
                  {attachment.isExternal && (
                    <span className="ml-1.5 text-xs text-muted-foreground/60">(external)</span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a href={fileBase} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <IconEye className="size-3.5" />
                    Preview
                  </Button>
                </a>
                <a href={`${fileBase}?download=true`} download>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <IconDownload className="size-3.5" />
                    Download
                  </Button>
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
