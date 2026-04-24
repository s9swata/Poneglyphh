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

export type VolunteerProfile = {
  userId: string;
  name: string | null;
  image: string | null;
  description: string | null;
  city: string | null;
  pastWorks: string[] | null;
  tags: Tag[];
};

export type VolunteerListItem = VolunteerProfile;

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type DatasetAttachment = {
  index: number;
  url: string;
  fileType: string;
  isExternal: boolean;
};

export type DatasetDetail = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  summary: string | null;
  publisher: string | null;
  publicationDate: string | null;
  language: string;
  fileTypes: string[] | null;
  status: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  sourceName: string;
  sourceType: string;
  isVerified: boolean;
  tags: Tag[];
  attachments: DatasetAttachment[];
};
