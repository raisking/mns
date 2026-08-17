export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  address?: string;
  coverImage?: string;
  donationUrl?: string;
  registrationUrl?: string;
  status: 'draft' | 'published' | 'completed';
}
