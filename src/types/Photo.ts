export interface Photo {
  id: string;
  albumId: string;
  objectKey: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  uploadedAt: string;
  displayOrder: number;
}
