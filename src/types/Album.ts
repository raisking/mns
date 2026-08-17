export interface Album {
  id: string;
  slug: string;
  title: string;
  description?: string;
  eventDate?: string;
  coverPhoto?: string;
  photoCount: number;
  status: 'public' | 'private' | 'hidden';
}
