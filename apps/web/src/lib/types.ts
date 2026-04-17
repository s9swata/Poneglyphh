export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type DatasetListItem = {
  id: string;
  title: string;
  description: string | null;
  thumbnailS3Key: string | null;
  publisher: string | null;
  language: string;
  fileTypes: string[] | null;
  status: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  tags?: Tag[];
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
