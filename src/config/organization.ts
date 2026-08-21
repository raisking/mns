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
  // 'school' (plain "Nepali School") was removed as redundant now that
  // this exists — every school-related donation/payment link in the app
  // (fee payment AND general "support the school" CTAs alike) points at
  // this one id. If a narrower "general support, not tuition" category is
  // ever wanted back, re-add it as a distinct id rather than reusing this
  // one, and repoint the non-tuition CTAs (Home's "Support Nepali School",
  // School page's "Support the School") back to it.
  { id: 'tuition', label: 'Nepali School Tuition' },
  // Membership page's tier picker carries its selected amount here, same
  // ?purpose=/&amount= handoff to /donate as the School fee toggle uses.
  { id: 'membership', label: 'Membership Dues' },
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
