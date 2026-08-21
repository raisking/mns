import SectionHeader from '../../components/common/SectionHeader';
import PageHero from '../../components/common/PageHero';
import Button from '../../components/common/Button';

// Grounded in what the rest of the site already documents MNS as doing
// (Sunday classes, festivals, the Gallery, community outreach, an
// Executive Committee) — not invented shifts/schedules or a formal
// volunteer-application process that doesn't exist yet.
const opportunities = [
  {
    title: 'Nepali School Teaching Assistant',
    description: 'Support our Sunday classes — help volunteer teachers lead language lessons, cultural activities, and keep our youngest students engaged.',
  },
  {
    title: 'Event Setup & Logistics',
    description: 'Help set up and break down venues for Dashain, Tihar, the summer picnic, and other community gatherings throughout the year.',
  },
  {
    title: 'Photography & Media',
    description: 'Capture our events and school activities for the Gallery and social media, helping tell the story of our community.',
  },
  {
    title: 'Hospitality & Food Coordination',
    description: 'Help organize food, seating, and hospitality so every gathering feels warm and welcoming for families of all ages.',
  },
  {
    title: 'Outreach & Welcome',
    description: 'Help welcome newly arrived Nepali families to Marietta and connect them with community resources and events.',
  },
  {
    title: 'Committees & Leadership',
    description: 'Join a planning committee or take on a role on the Executive Committee — help shape what MNS does next.',
  },
];

const volunteerMessage = "I'd like to volunteer with MNS. Here's a bit about myself and how I'd like to help:";

export default function Volunteer() {
  return (
    <>
      <PageHero
        eyebrow="स्वयंसेवा · Get Involved"
        title="Volunteer With Us"
        subtitle="Marietta Nepali Samaj runs entirely on volunteer effort — from Sunday classes to festival stages. There's a place here for your time and skills."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-ink-soft leading-relaxed">
            Every class taught, every festival held, and every family welcomed happens because someone gave their time. Whether you have a few hours once a year or want an ongoing role, we'd love to have you.
          </p>
        </section>

        <SectionHeader title="Ways to Volunteer" subtitle="A few of the areas where volunteers make the biggest difference." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {opportunities.map(item => (
            <div key={item.title} className="card-lift bg-white rounded-2xl p-6">
              <h3 className="font-bold text-ink mb-2">{item.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA — same saffron-gradient banner pattern as School's closing CTA */}
        <div className="text-center bg-gradient-to-br from-saffron to-saffron-dark rounded-2xl p-10 md:p-14 text-white">
          <p className="text-marigold text-sm font-semibold uppercase tracking-wider mb-3">सहभागिता · Join In</p>
          <h2 className="text-2xl md:text-3xl mb-4">Ready to Get Involved?</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
            Tell us a bit about yourself and how you'd like to help — we'll follow up and find the right fit.
          </p>
          <Button
            to={`/contact?subject=volunteer&message=${encodeURIComponent(volunteerMessage)}`}
            size="lg"
            variant="light"
          >
            Sign Up to Volunteer
          </Button>
        </div>
      </div>
    </>
  );
}
