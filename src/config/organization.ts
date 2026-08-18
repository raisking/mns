export const organization = {
  name: 'Marietta Nepali Samaj',
  shortName: 'MNS',
  tagline: 'Connecting Our Community. Preserving Our Culture. Building Our Future.',
  email: 'info@mariettanepalisamaj.org',
  phone: '',
  // Note: user supplied "2727 Conton Road" — corrected to "Canton Road"
  // (a real road in Marietta, GA; "Conton" isn't), since this is a public-
  // facing physical address. Flag/fix if that assumption is wrong.
  address: '2727 Canton Road, Marietta, GA 30066',
  founded: '2010',
};

export const socialLinks = {
  facebook: 'https://www.facebook.com/profile.php?id=61584445633390',
  youtube: 'https://www.youtube.com',
  // Empty on purpose — no real Instagram account/handle yet. SocialIcons
  // (src/components/common/SocialIcons.tsx) skips any platform with a
  // falsy URL here, so this just stays hidden everywhere until a real
  // profile URL is set.
  instagram: '',
};

export const donationCategories = [
  { id: 'general', label: 'General Fund' },
  { id: 'school', label: 'Nepali School' },
  { id: 'events', label: 'Community Events' },
  { id: 'education', label: 'Education Fund' },
  { id: 'dashain', label: 'Dashain Celebration' },
  { id: 'tihar', label: 'Tihar Celebration' },
  { id: 'picnic', label: 'Summer Picnic' },
  { id: 'emergency', label: 'Emergency Fund' },
  { id: 'cultural', label: 'Cultural Programs' },
  { id: 'other', label: 'Other' },
];

export const donationAmounts = [25, 50, 100, 250];
