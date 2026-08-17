import type { Event } from '../types/Event';
import type { Album } from '../types/Album';
import type { LeadershipMember, PastPresident } from '../types/Leadership';
import type { Post } from '../types/Post';
import heroBanner from '../assets/nepali-school-banner.png';
import dashain2026Img from '../assets/dashain2026.png';

// Unsplash placeholder images — these will be replaced with real R2 URLs
const HERO_IMG = heroBanner;
const COMMUNITY_IMG = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80';
const SCHOOL_IMG = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80';
const EVENT1_IMG = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80';
const EVENT2_IMG = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80';
const EVENT3_IMG = 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80';
const DASHAIN_2026_IMG = dashain2026Img;
const PERSON_IMG = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80';
const GALLERY1 = 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80';
const GALLERY2 = 'https://images.unsplash.com/photo-1601758174493-49e52f2e5e4d?w=600&q=80';
const GALLERY3 = 'https://images.unsplash.com/photo-1513623935135-c896b59073c1?w=600&q=80';
const GALLERY4 = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80';
const GALLERY5 = 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=600&q=80';
const GALLERY6 = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80';

export const heroImage = HERO_IMG;
export const communityImage = COMMUNITY_IMG;
export const schoolImage = SCHOOL_IMG;

export const mockEvents: Event[] = [
  {
    id: '1',
    slug: 'nepali-new-year-2082',
    title: 'Nepali New Year 2082 (Nava Barsha)',
    description: 'Join us to celebrate the Nepali New Year 2082 with cultural programs, traditional music, dance performances, and delicious Nepali food. Come and enjoy the festivities with the entire Nepali community of Marietta.',
    date: '2026-04-13',
    startTime: '11:00 AM',
    endTime: '6:00 PM',
    location: 'Marietta Community Center',
    address: '123 Community Dr, Marietta, GA 30060',
    coverImage: EVENT1_IMG,
    status: 'published',
  },
  {
    id: '2',
    slug: 'summer-picnic-2026',
    title: 'Annual Summer Picnic 2026',
    description: 'Our beloved annual summer picnic returns! Bring your family for a day of fun, games, great food, and wonderful community bonding at one of Marietta\'s beautiful parks.',
    date: '2026-07-04',
    startTime: '10:00 AM',
    endTime: '5:00 PM',
    location: 'Kennesaw Mountain National Park',
    address: '900 Kennesaw Mountain Dr, Kennesaw, GA 30152',
    coverImage: EVENT2_IMG,
    status: 'published',
  },
  {
    id: '3',
    slug: 'dashain-celebration-2026',
    title: 'Dashain Celebration 2026',
    description: 'Celebrate Dashain, the greatest festival of Nepal, with the Marietta Nepali community. Traditional rituals, Tika ceremony, cultural performances, and festive meals.',
    date: '2026-10-10',
    startTime: '4:00 PM',
    endTime: '10:00 PM',
    location: 'Marietta Event Hall',
    address: '456 Celebration Ave, Marietta, GA 30060',
    coverImage: DASHAIN_2026_IMG,
    status: 'published',
  },
  {
    id: '4',
    slug: 'dashain-2025',
    title: 'Dashain Celebration 2025',
    description: 'A wonderful evening of celebration, culture, and community for Dashain 2025.',
    date: '2025-10-02',
    startTime: '4:00 PM',
    endTime: '10:00 PM',
    location: 'Marietta Event Hall',
    address: '456 Celebration Ave, Marietta, GA 30060',
    coverImage: EVENT3_IMG,
    status: 'completed',
  },
];

export const mockAlbums: Album[] = [
  {
    id: '1',
    slug: 'nepali-new-year-2081',
    title: 'Nepali New Year 2081',
    description: 'Photos from our vibrant New Year celebration.',
    eventDate: '2024-04-14',
    coverPhoto: GALLERY1,
    photoCount: 120,
    status: 'public',
  },
  {
    id: '2',
    slug: 'summer-picnic-2025',
    title: 'Summer Picnic 2025',
    description: 'A beautiful day at the park with our community.',
    eventDate: '2025-07-04',
    coverPhoto: GALLERY2,
    photoCount: 85,
    status: 'public',
  },
  {
    id: '3',
    slug: 'nepali-school-program-2025',
    title: 'Nepali School Program 2025',
    description: 'Students showcase their language and cultural skills.',
    eventDate: '2025-06-15',
    coverPhoto: GALLERY3,
    photoCount: 45,
    status: 'public',
  },
  {
    id: '4',
    slug: 'dashain-2025',
    title: 'Dashain Celebration 2025',
    description: 'Dashain Tika and cultural programs.',
    eventDate: '2025-10-02',
    coverPhoto: GALLERY4,
    photoCount: 150,
    status: 'public',
  },
];

export const galleryPreviewPhotos = [
  GALLERY1, GALLERY2, GALLERY3, GALLERY4, GALLERY5, GALLERY6,
];

export const executiveCommittee: LeadershipMember[] = [
  { id: '1', name: 'Rajesh Sharma', position: 'President', photo: PERSON_IMG, bio: 'Leading our community with vision and dedication.' },
  { id: '2', name: 'Sunita Thapa', position: 'Vice President', photo: PERSON_IMG },
  { id: '3', name: 'Bikram Adhikari', position: 'Secretary', photo: PERSON_IMG },
  { id: '4', name: 'Anita Gurung', position: 'Joint Secretary', photo: PERSON_IMG },
  { id: '5', name: 'Pramod Karki', position: 'Treasurer', photo: PERSON_IMG },
  { id: '6', name: 'Sita Rai', position: 'Executive Member', photo: PERSON_IMG },
  { id: '7', name: 'Dinesh Poudel', position: 'Executive Member', photo: PERSON_IMG },
  { id: '8', name: 'Maya Shrestha', position: 'Executive Member', photo: PERSON_IMG },
];

export const president = executiveCommittee[0];

export const pastPresidents: PastPresident[] = [
  { id: '1', name: 'Binod Bhattarai', photo: PERSON_IMG, term: '2022–2024', description: 'Led the organization through significant growth.' },
  { id: '2', name: 'Kamal Regmi', photo: PERSON_IMG, term: '2020–2022', description: 'Established the Nepali School program.' },
  { id: '3', name: 'Hira Tamang', photo: PERSON_IMG, term: '2018–2020', description: 'Founded key community partnerships.' },
  { id: '4', name: 'Gopal Acharya', photo: PERSON_IMG, term: '2016–2018' },
  { id: '5', name: 'Laxmi Devi KC', photo: PERSON_IMG, term: '2014–2016' },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    author: 'Nepali School - Marietta',
    context: 'with Abina Ghimire and 2 others',
    date: '2026-01-11',
    content: 'जन्म दिनको धेरै धेरै शुभकामना रोजित शर्मा। तिम्रो जीवन सफल र सुखमय रहोस्!\n\n#Nepalischool #Marietta #Birthdaycelebration #bestwishes',
    reply: { author: 'Abina Ghimire', text: 'Thank you 🙏' },
  },
  {
    id: '2',
    author: 'Nepali School - Marietta',
    date: '2026-01-05',
    content: 'Admission Open! Enroll now for Spring 2026 at Marietta Nepali School!',
  },
  {
    id: '3',
    author: 'Sri Wagle',
    context: 'posted to Nepali School - Marietta',
    date: '2026-01-01',
    content: 'Happy Birthday!',
  },
  {
    id: '4',
    author: 'Sri Wagle',
    context: 'is feeling happy with Nepali School - Marietta and 23 others',
    date: '2025-12-30',
    content: 'Kentucky, ZERO to 8848 is coming to your city on January 10th 2026.',
  },
];

export const objectives = [
  {
    icon: '🤝',
    title: 'Community',
    titleNp: 'समुदाय',
    description: 'Strengthen relationships within the Nepali community and support families in Marietta and surrounding areas.',
  },
  {
    icon: '🪔',
    title: 'Culture',
    titleNp: 'संस्कृति',
    description: 'Preserve and celebrate Nepali culture, traditions, festivals, music, and arts for future generations.',
  },
  {
    icon: '📚',
    title: 'Education',
    titleNp: 'शिक्षा',
    description: 'Promote Nepali language education through our Nepali School and support academic excellence among our youth.',
  },
  {
    icon: '🙌',
    title: 'Service',
    titleNp: 'सेवा',
    description: 'Organize volunteer programs and provide community assistance to those in need.',
  },
];
