import type { Event } from '../types/Event';
import type { Album } from '../types/Album';
import type { LeadershipMember, PastPresident } from '../types/Leadership';
import type { Shoutout } from '../types/Shoutout';
import type { SchoolStaffMember } from '../types/SchoolStaff';
import heroBanner from '../assets/nepali-school-banner.png';
import parentsDayImg from '../assets/events/parents-day.jpg';
import summerPicnic2026Img from '../assets/events/summar.jpg';
import holi2026Img from '../assets/events/holi.jpg';
import parentTeacher2026Img from '../assets/events/parent-teacher.jpg';
import prakashKhattriImg from '../assets/profile/prakash_khattri.jpg';
import rajChairmanImg from '../assets/profile/raj_chairman_mns.jpg';
import languageCultureImg from '../assets/slide/language_culture.jpeg';
import kidsDancingImg from '../assets/slide/kids_dancing.jpeg';
import kidsLaughingImg from '../assets/slide/kids_laughing.jpeg';
import kidsSchoolImg from '../assets/slide/kids_school.jpeg';
import kidsSlideImg from '../assets/slide/kids_slide.jpeg';
import bhabindraBasnetImg from '../assets/slide/Bhabindra_Basnet.jpg';
import heroVideoSrc from '../assets/mns-video.mp4';

// Unsplash placeholder images — these will be replaced with real R2 URLs
const HERO_IMG = heroBanner;
const PRINCIPAL_IMG = prakashKhattriImg; // real photo — not a placeholder
const CHAIRMAN_IMG = rajChairmanImg; // real photo — not a placeholder
const PRESIDENT_IMG = bhabindraBasnetImg; // real photo — not a placeholder
const COMMUNITY_IMG = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80';
const SCHOOL_IMG = languageCultureImg; // real photo — not a placeholder
const PARENTS_DAY_2026_IMG = parentsDayImg; // real flyer — not a placeholder
const SUMMER_PICNIC_2026_IMG = summerPicnic2026Img; // real flyer — not a placeholder
const HOLI_2026_IMG = holi2026Img; // real flyer — not a placeholder
const PARENT_TEACHER_2026_IMG = parentTeacher2026Img; // real flyer — not a placeholder
const PERSON_IMG = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80';
const PERSON_IMG2 = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80';
const PERSON_IMG3 = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80';
const PERSON_IMG4 = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80';
const PERSON_IMG5 = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80';
// Nepal-specific replacements for the previous generic/off-theme set (a
// Japanese lantern street, a dead 404 link, a Western wedding table, a
// tropical resort, a burger, and an unrelated mountain range — none of
// which read as "Marietta Nepali Samaj"). Every URL below was verified
// with a live HTTP 200 and eyeballed before use.
const GALLERY1 = 'https://images.unsplash.com/photo-1550642249-b715bc35f898?w=600&q=80'; // Patan Durbar Square, Nepal's flag flying over the crowd
const GALLERY2 = 'https://images.unsplash.com/photo-1513614835783-51537729c8ba?w=600&q=80'; // Prayer flags strung across a Himalayan mountain stream
const GALLERY3 = 'https://images.unsplash.com/photo-1763733594205-4a48978cd5e6?w=600&q=80'; // Girls in traditional dress performing a folk dance on stage
const GALLERY4 = 'https://images.unsplash.com/photo-1770904336762-6ff2ecdab4d1?w=600&q=80'; // Boy with a red tika on his forehead, smiling
const GALLERY5 = 'https://images.unsplash.com/photo-1648298470994-7065f521375c?w=600&q=80'; // Pashupatinath Temple's golden pagoda roofs, Kathmandu
const GALLERY6 = 'https://images.unsplash.com/photo-1507743617593-0a422c9bb7f5?w=600&q=80'; // Kathmandu Durbar Square temple at dusk

export const heroImage = HERO_IMG;
export const heroVideo = heroVideoSrc;
export const communityImage = COMMUNITY_IMG;
export const schoolImage = SCHOOL_IMG;

// Home page's "Nepali Language & Culture" carousel. Only the first two are
// real Nepali School photos (a cultural dance performance and the alphabet-
// puzzle photo also used as schoolImage above); the rest are generic stock
// classroom/family photos with no connection to Nepal or this community,
// included at the site owner's request for rotation variety. Alt text is
// written to describe what's actually in each photo rather than implying
// they're all real MNS moments.
export const schoolCarouselSlides = [
  { src: languageCultureImg, alt: 'Students working together on a Nepali alphabet puzzle in class' },
  { src: kidsDancingImg, alt: 'Students in traditional Nepali dress performing a cultural dance on stage' },
  { src: kidsLaughingImg, alt: 'Students laughing together in the classroom' },
  { src: kidsSchoolImg, alt: 'Students raising their hands to answer in class' },
  { src: kidsSlideImg, alt: 'A parent helping a child with schoolwork' },
];

export const mockEvents: Event[] = [
  {
    id: '5',
    slug: 'parents-day-graduation-2026',
    title: '1st Parents Day & Graduation Ceremony 2026',
    // Copy follows the official flyer (src/assets/parents-day.jpg) closely:
    // its "Join Us For" list and closing message, condensed into prose
    // since Event.description renders as a single paragraph, not a list.
    description: 'Nepali School Marietta\'s first-ever Parents Day & Graduation Ceremony! Join us for student presentations, the graduation ceremony, awards and recognitions, and refreshments and fellowship. Your presence means a lot — let\'s come together to encourage our children and celebrate their hard work and bright future. We look forward to celebrating this memorable day with you!',
    date: '2026-08-30',
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'Taj Mahal Grill',
    // Address matches the flyer exactly — no city given there, and 30144
    // is actually Kennesaw's zip, not Marietta's, so guessing "Marietta"
    // into the string would risk adding a wrong city rather than a helpful one.
    address: '1200 Ernest Barrett Pkwy, GA 30144',
    coverImage: PARENTS_DAY_2026_IMG,
    status: 'published',
  },
  {
    id: '2',
    slug: 'summer-picnic-2026',
    title: 'Summer Picnic 2026',
    // Real flyer details (organized by Marietta Nepali Samaj, together with
    // Nepali School Marietta) supersede the earlier placeholder date/venue.
    // Status flipped to completed — June 14, 2026 already passed by the
    // time this was added (today: Aug 23, 2026).
    description: 'Marietta Nepali Samaj, together with Nepali School Marietta, hosted a summer picnic at Swift Cantrell Park — potluck dishes, fun games for all ages, and live music and folk dance performances. Free entry for all; families brought picnic blankets, chairs, and a dish to share.',
    date: '2026-06-14',
    startTime: '2:00 PM',
    endTime: '8:00 PM',
    location: 'Swift Cantrell Park',
    address: '7650 Central Park Dr, Marietta, GA 30062',
    coverImage: SUMMER_PICNIC_2026_IMG,
    status: 'completed',
  },
  {
    id: '6',
    slug: 'holi-celebration-2026',
    title: 'Holi Celebration 2026',
    // Per the official flyer: this was Atlanta Nepali School's event —
    // Nepali School Marietta's students/families joined as guests, not as
    // the organizing body. Worded to keep that distinction accurate rather
    // than implying MNS organized it.
    description: "Nepali School Marietta's students, guardians, and teachers joined Atlanta Nepali School's Holi Celebration — the joyful festival of colors, celebrating happiness, unity, and togetherness with the wider Atlanta Nepali community.",
    date: '2026-03-01',
    startTime: '10:30 AM',
    location: 'NCC',
    address: '1249 Jennie Lane, Lilburn, GA',
    coverImage: HOLI_2026_IMG,
    status: 'completed',
  },
  {
    id: '7',
    slug: 'parent-teacher-interaction-june-2026',
    title: 'Parents-Teachers Interaction Program',
    description: "Nepali School Marietta invited parents and guardians to a Parents-Teachers Interaction Program: a review of the school's teaching and learning activities so far, a discussion of the school's Annual Day Celebration, feedback collection from guardians, and a look at plans for the graduation ceremony for the school's senior students. Guardians were asked to arrive on time, 10:45 AM sharp.",
    date: '2026-06-28',
    startTime: '10:45 AM',
    location: 'Nepali School Marietta',
    coverImage: PARENT_TEACHER_2026_IMG,
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

// Every name below except the current President (real person, real photo —
// see PRESIDENT_IMG above) is placeholder: swapped to Joe Doe/Mary Jane at
// the site owner's request, alternating in file order. The same real person
// appearing in more than one list (e.g. a past President who also appears
// in executiveCommitteeArchive) keeps one consistent replacement name
// across every list they're in, matching the "don't contradict each other"
// invariant executiveCommitteeArchive's comment already documents.
export const executiveCommittee: LeadershipMember[] = [
  { id: '1', name: 'Bhabindra Basnet', position: 'President', photo: PRESIDENT_IMG, bio: 'Leading our community with vision and dedication.' },
  { id: '2', name: 'Joe Doe', position: 'Vice President', photo: PERSON_IMG },
  { id: '3', name: 'Mary Jane', position: 'Secretary', photo: PERSON_IMG },
  { id: '4', name: 'Joe Doe', position: 'Joint Secretary', photo: PERSON_IMG },
  { id: '5', name: 'Mary Jane', position: 'Treasurer', photo: PERSON_IMG },
  { id: '6', name: 'Joe Doe', position: 'Executive Member', photo: PERSON_IMG },
  { id: '7', name: 'Mary Jane', position: 'Executive Member', photo: PERSON_IMG },
  { id: '8', name: 'Joe Doe', position: 'Executive Member', photo: PERSON_IMG },
];

export const president = executiveCommittee[0];

export const pastPresidents: PastPresident[] = [
  { id: '1', name: 'Mary Jane', photo: PERSON_IMG, term: '2022–2024', description: 'Led the organization through significant growth.' },
  { id: '2', name: 'Joe Doe', photo: PERSON_IMG, term: '2020–2022', description: 'Established the Nepali School program.' },
  { id: '3', name: 'Mary Jane', photo: PERSON_IMG, term: '2018–2020', description: 'Founded key community partnerships.' },
  { id: '4', name: 'Joe Doe', photo: PERSON_IMG, term: '2016–2018' },
  { id: '5', name: 'Mary Jane', photo: PERSON_IMG, term: '2014–2016' },
];

// Invented placeholder names, like every other roster in this file —
// About page's own History timeline already says MNS started as an
// informal 2010 gathering before formally organizing in 2012, so these
// predate pastPresidents' earliest listed term (2014–2016) rather than
// overlapping/contradicting it. Replace with the real founders' names
// once available.
export const founders: LeadershipMember[] = [
  { id: '1', name: 'Joe Doe', position: 'Founding President', photo: PERSON_IMG2, bio: 'Helped bring the first informal gatherings together in 2010.' },
  { id: '2', name: 'Mary Jane', position: 'Founding Secretary', photo: PERSON_IMG3 },
  { id: '3', name: 'Joe Doe', position: 'Founding Treasurer', photo: PERSON_IMG4 },
  { id: '4', name: 'Mary Jane', position: 'Founding Member', photo: PERSON_IMG5 },
];

// Yearly Executive Committee rosters — each term's President matches the
// corresponding pastPresidents entry above (same person, same years) so
// the two lists don't contradict each other; the other officers are
// invented, same placeholder-data convention as the rest of this file.
export const executiveCommitteeArchive: { term: string; members: LeadershipMember[] }[] = [
  {
    term: '2022–2024',
    members: [
      { id: '1', name: 'Mary Jane', position: 'President', photo: PERSON_IMG },
      { id: '2', name: 'Joe Doe', position: 'Vice President', photo: PERSON_IMG2 },
      { id: '3', name: 'Mary Jane', position: 'Secretary', photo: PERSON_IMG3 },
      { id: '4', name: 'Joe Doe', position: 'Treasurer', photo: PERSON_IMG4 },
    ],
  },
  {
    term: '2020–2022',
    members: [
      { id: '1', name: 'Joe Doe', position: 'President', photo: PERSON_IMG },
      { id: '2', name: 'Mary Jane', position: 'Vice President', photo: PERSON_IMG2 },
      { id: '3', name: 'Joe Doe', position: 'Secretary', photo: PERSON_IMG3 },
      { id: '4', name: 'Mary Jane', position: 'Treasurer', photo: PERSON_IMG4 },
    ],
  },
  {
    term: '2018–2020',
    members: [
      { id: '1', name: 'Mary Jane', position: 'President', photo: PERSON_IMG },
      { id: '2', name: 'Joe Doe', position: 'Vice President', photo: PERSON_IMG2 },
      { id: '3', name: 'Mary Jane', position: 'Secretary', photo: PERSON_IMG3 },
      { id: '4', name: 'Joe Doe', position: 'Treasurer', photo: PERSON_IMG4 },
    ],
  },
];

export const objectives = [
  {
    title: 'Community',
    titleNp: 'समुदाय',
    description: 'Strengthen relationships within the Nepali community and support families in Marietta and surrounding areas.',
  },
  {
    title: 'Culture',
    titleNp: 'संस्कृति',
    description: 'Preserve and celebrate Nepali culture, traditions, festivals, music, and arts for future generations.',
  },
  {
    title: 'Education',
    titleNp: 'शिक्षा',
    description: 'Promote Nepali language education through our Nepali School and support academic excellence among our youth.',
  },
  {
    title: 'Service',
    titleNp: 'सेवा',
    description: 'Organize volunteer programs and provide community assistance to those in need.',
  },
];

export const shoutoutMonth = 'August 2026';

export const monthlyShoutouts: Shoutout[] = [
  {
    id: '1',
    name: 'Mary Jane',
    category: 'Member',
    photo: PERSON_IMG,
    highlight: "Organized this month's community potluck and personally welcomed three new families to MNS.",
  },
  {
    id: '2',
    name: 'Joe Doe',
    category: 'Student',
    photo: PERSON_IMG2,
    highlight: "Perfect attendance at Nepali School this month — and always first to help younger students with their alphabet.",
  },
  {
    id: '3',
    name: 'Mary Jane',
    category: 'Volunteer',
    photo: PERSON_IMG3,
    highlight: 'Showed up early and stayed late for setup and cleanup at every single event this month, rain or shine.',
  },
];

export const schoolStaff: SchoolStaffMember[] = [
  {
    id: '0',
    name: 'Rajkumar Bohora',
    position: 'Chairman',
    category: 'Chairman',
    photo: CHAIRMAN_IMG,
    bio: 'Rajkumar has lived in and served the Marietta community for many years, bringing that same long-standing commitment to his role as Chairman — helping guide Nepali School Marietta and support the community it serves. He is also a local restaurant business owner.',
  },
  {
    id: '1',
    name: 'Prakash Khatri',
    position: 'Principal',
    category: 'Principal',
    photo: PRINCIPAL_IMG,
    bio: 'Prakash brings years of teaching experience from Nepal, where he taught in both public and private schools before moving to Marietta. He leads the Nepali School with a focus on making language learning joyful for every child, regardless of how much Nepali they speak at home — and believes every class should leave students a little prouder of where their family comes from.',
  },
  {
    id: '2',
    name: 'Joe Doe',
    position: 'Nepali Language Teacher',
    category: 'Teacher',
    photo: PERSON_IMG5,
    bio: 'Teaches reading and writing from the alphabet up, and has been part of the school since its earliest classes.',
  },
  {
    id: '3',
    name: 'Mary Jane',
    position: 'Cultural Arts & Dance Teacher',
    category: 'Teacher',
    photo: PERSON_IMG2,
    bio: "Leads traditional dance and craft lessons, and choreographs the students' performances for Dashain and Tihar.",
  },
  {
    id: '4',
    name: 'Joe Doe',
    position: 'Music Teacher',
    category: 'Teacher',
    photo: PERSON_IMG,
    bio: 'Teaches folk songs and traditional instruments, helping students connect with Nepali music across generations.',
  },
  {
    id: '5',
    name: 'Mary Jane',
    position: 'Volunteer Coordinator',
    category: 'Volunteer',
    photo: PERSON_IMG3,
    bio: 'Organizes the volunteer schedule every semester and is usually the first person new families meet on a Sunday morning.',
  },
  {
    id: '6',
    name: 'Joe Doe',
    position: 'Classroom Volunteer',
    category: 'Volunteer',
    photo: PERSON_IMG4,
    bio: 'Assists in the younger classrooms and helps run snack time and recess every week.',
  },
];
