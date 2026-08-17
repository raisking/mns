export interface Shoutout {
  id: string;
  name: string;
  category: 'Member' | 'Student' | 'Volunteer';
  photo: string;
  /** What they did — the specific reason for the recognition. */
  highlight: string;
}
