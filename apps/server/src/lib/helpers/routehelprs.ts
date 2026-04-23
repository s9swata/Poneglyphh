export function isExternalUrl(value: string): boolean {
  return /^https?:\/\//.test(value);
}

export function inferFileType(keyOrUrl: string): string {
  const path = keyOrUrl.split("?")[0] ?? keyOrUrl;
  const ext = path.split(".").pop()?.toLowerCase() ?? "other";
  const known = ["pdf", "csv", "xlsx", "xls", "json", "docx", "zip"];

  return known.includes(ext) ? ext : "other";
}

export function getDatasetAttachmentUrl(datasetId: string, index: number): string {
  return `/api/datasets/${datasetId}/files/${index}`;
}

export function normalizePgTextArray(value: string[] | string | null): string[] | null {
  if (value === null) return null;
  if (Array.isArray(value)) return value;

  const trimmed = value.trim();
  if (trimmed === "{}") return [];
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return [trimmed];

  return trimmed
    .slice(1, -1)
    .split(",")
    .map((item) => item.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
}
