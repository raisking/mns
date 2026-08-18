export interface SchoolStaffMember {
  id: string;
  name: string;
  /** Specific title shown on the card, e.g. "Nepali Language Teacher". */
  position: string;
  category: 'Principal' | 'Teacher' | 'Volunteer';
  photo: string;
  bio?: string;
}
