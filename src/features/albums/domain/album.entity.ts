export interface AlbumSummary {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  order: number;
  memoryCount: number;
}

export interface AlbumDetail extends AlbumSummary {
  createdAt: Date;
}
