import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mockEvents, galleryPreviewPhotos, objectives, heroImage, schoolCarouselSlides, monthlyShoutouts, shoutoutMonth } from '../../data/mockData';
import { organization } from '../../config/organization';
import SectionHeader from '../../components/common/SectionHeader';
import EventCard from '../../components/events/EventCard';
import Button from '../../components/common/Button';
import ShoutoutModal from '../../components/common/ShoutoutModal';
import ImageCarousel from '../../components/common/ImageCarousel';

// sessionStorage (not localStorage): shows once for as long as this tab/
// session stays open, but comes back on a fresh visit — new tab, browser
// restart, or clearing site data/cache all reset it, since that's exactly
// what clears sessionStorage too.
const SHOUTOUT_STORAGE_KEY = 'mns-shoutout-seen';

export default function Home() {
  const upcomingEvents = mockEvents.filter(e => e.status === 'published').slice(0, 3);
  const [shoutoutOpen, setShoutoutOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(SHOUTOUT_STORAGE_KEY)) {
      setShoutoutOpen(true);
    }
  }, []);

  const closeShoutout = () => {
    setShoutoutOpen(false);
    sessionStorage.setItem(SHOUTOUT_STORAGE_KEY, '1');
  };

  return (
    <>
      <ShoutoutModal
        open={shoutoutOpen}
        onClose={closeShoutout}
        shoutouts={monthlyShoutouts}
        month={shoutoutMonth}
      />

      {/* Hero — a soft twin-peak curve at the bottom edge echoes Nepal's
          flag silhouette (this site's one signature shape), rendered as an
          SVG divider rather than a hard clip-path so the peaks are smooth
          curves and the fill matches the next section's color exactly
          instead of a cutout revealing the page background underneath. */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden"
        aria-label="Hero section"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
          role="img"
          aria-label="Community celebration"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/40 to-ink/85" />
        {/* Extra vignette behind the text block, so headline contrast holds
            regardless of what's underneath in the photo. */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 45%, rgba(36,23,18,0.55), transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="text-white text-base sm:text-lg font-semibold tracking-wide mb-6 drop-shadow-lg">
            स्वागत छ।
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight mb-6 drop-shadow-lg">
            Welcome to<br />
            <span className="text-marigold">{organization.name}</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            {organization.tagline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/about" size="lg" variant="outlineLight">
              Explore Our Community
            </Button>
            {/* Donate already gets its own dedicated, always-visible marigold
                "pill + pin" treatment in the Header (see Header.tsx) — this
                spot fits a new visitor's more natural first move better:
                "what's actually happening" rather than a second donate ask
                one scroll after the header's. variant="light" (not
                "accent"/marigold) on purpose, so this button doesn't read as
                a second Donate button next to the Header's marigold one. */}
            <Button to="/events" size="lg" variant="light">
              See Upcoming Events
            </Button>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Twin-peak divider — filled with the next section's exact
            bg-paper-deep color, so it reads as one smooth shape flowing
            into the content below rather than a hard-edged cutout. */}
        <svg
          className="absolute -bottom-px left-0 w-full h-16 sm:h-20 md:h-28"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="var(--color-paper-deep)"
            style={{ filter: 'drop-shadow(0 -3px 6px rgba(36,23,18,0.07))' }}
            d="M0,41 C150,64 270,70 360,70 C450,70 510,40 720,40 C930,40 990,70 1080,70 C1170,70 1290,64 1440,41 L1440,120 L0,120 Z"
          />
        </svg>
      </section>

      {/* Nepali School — MNS's most active program, given top billing right
          after the hero instead of buried mid-page. */}
      <section className="py-16 md:py-20 bg-paper-deep overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <ImageCarousel
                  slides={schoolCarouselSlides}
                  label="Nepali School photos"
                  className="w-full h-80 md:h-[26rem]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center gap-1.5 bg-marigold text-ink text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-sm">
                    MNS's Most Active Program
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 rounded-xl p-3 shadow">
                    <p className="text-sm font-bold text-ink">Nepali Language & Culture</p>
                    <p className="text-xs text-ink-soft mt-0.5">Teaching the next generation their heritage</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">नेपाली पाठशाला · Nepali School</p>
              <h2 className="text-3xl md:text-4xl text-ink mb-4">
                Where Our Community Shows Up Every Week
              </h2>
              <p className="text-ink-soft leading-relaxed mb-6">
                Of everything MNS runs, the Nepali School is where our community gathers most. It's our most active program — a weekly gathering that teaches Nepali language, culture, and values to the next generation.
              </p>

              {/* Activity stats — evidence for "most active," not just the claim.
                  The fee card links to the School page's full pricing (Home
                  is a summary, not the place to spell out member/non-member
                  rates) — the only one of the three that goes anywhere. */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { value: 'Weekly', label: 'Every Sunday' },
                  { value: 'PreK to Grade 8', label: 'Grades Welcome' },
                  { value: '$200+', label: 'Fee Details', to: '/nepali-school#fees' },
                ].map(stat =>
                  stat.to ? (
                    <Link
                      key={stat.label}
                      to={stat.to}
                      className="group bg-white rounded-xl p-3 text-center shadow-sm ring-1 ring-transparent hover:ring-saffron/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 transition-all duration-200"
                    >
                      <p className="text-lg font-display font-bold text-saffron leading-none">{stat.value}</p>
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-saffron/10 group-hover:bg-saffron text-saffron group-hover:text-white text-xs font-semibold px-2.5 py-1 transition-colors duration-200">
                        {stat.label}
                        <svg
                          className="w-3 h-3 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  ) : (
                    <div key={stat.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                      <p className="text-lg font-display font-bold text-saffron leading-none">{stat.value}</p>
                      <p className="text-xs text-ink-soft mt-1">{stat.label}</p>
                    </div>
                  )
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Nepali language reading and writing',
                  'Cultural traditions and values',
                  "Children's programs and activities",
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-ink-soft">
                    <svg className="w-5 h-5 text-saffron flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button to="/nepali-school" variant="primary">Learn About Our School</Button>
                <Button to="/contact" variant="outline">Enroll Your Child</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events — moved right after the Nepali School section so
          "what's happening" follows MNS's most active program immediately,
          rather than waiting behind the About Preview block. bg-white here
          (was bg-paper-deep) and bg-paper-deep on About Preview below (was
          bg-white) keeps the alternating background rhythm intact now that
          the two sections have swapped places. */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="कार्यक्रमहरू"
            title="Upcoming Events"
            subtitle="Join us for our community celebrations, cultural programs, and activities."
          />
          {upcomingEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-ink-soft">
              <p>No upcoming events are currently scheduled. Please check back soon.</p>
            </div>
          )}
          <div className="text-center">
            <Button to="/events" variant="outline">View All Events</Button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-20 bg-paper-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">हाम्रो समुदाय · Who We Are</p>
              <h2 className="text-3xl md:text-4xl text-ink mb-6">
                A Home Away From Home for the Nepali Community
              </h2>
              <p className="text-ink-soft text-lg leading-relaxed mb-4">
                Marietta Nepali Samaj is a nonprofit community organization dedicated to uniting Nepali families, students, and professionals in the Marietta, Georgia area.
              </p>
              <p className="text-ink-soft leading-relaxed mb-8">
                We celebrate our rich cultural heritage through festivals, educational programs, and community service. Whether you are a longtime resident or newly arrived, MNS is your community.
              </p>
              <Button to="/about" variant="primary">Learn More About Us</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {objectives.map(obj => (
                <div key={obj.title} className="card-lift bg-white rounded-2xl p-5">
                  <h3 className="text-ink mb-1">
                    {obj.title} <span className="text-ink-soft/60 font-normal">· {obj.titleNp}</span>
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{obj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor & Advertise CTA — indigo, the flag's border color, giving
          this CTA its own identity apart from the saffron donation CTA. */}
      <section className="py-14 md:py-16 bg-indigo text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-marigold text-sm font-semibold uppercase tracking-wider mb-3">सहयोग · Sponsorship</p>
          <h2 className="text-2xl md:text-3xl mb-5">Sponsor & Advertise With Us</h2>
          <p className="text-white/80 leading-relaxed max-w-2xl mx-auto mb-2">
            Showcase your name or business to the Marietta Nepali community while supporting the programs that bring us together.
          </p>
          <p className="text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
            Flexible sponsorship packages are available on a quarterly, semi-annual, or annual basis. Contact us to learn more about visibility and rates.
          </p>
          <Button to="/contact" variant="outlineLight">
            Contact Us
          </Button>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 md:py-20 bg-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="सम्झनाहरू"
            title="Community Gallery"
            subtitle="Moments from our celebrations, programs, and community life."
            light
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {galleryPreviewPhotos.map((url, i) => (
              <Link
                key={i}
                to="/gallery"
                className="group relative aspect-square overflow-hidden rounded-xl bg-white/5"
                aria-label={`View gallery photo ${i + 1}`}
              >
                <img
                  src={url}
                  alt={`Community photo ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Button to="/gallery" variant="outlineLight">
              View All Albums
            </Button>
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-saffron to-saffron-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-marigold text-sm font-semibold uppercase tracking-wider mb-3">धन्यवाद · Thank You</p>
          <h2 className="text-3xl md:text-4xl mb-4">Support Our Community</h2>
          <p className="text-lg text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your generosity helps us continue our cultural programs, educational initiatives, and community events. Every contribution makes a difference.
          </p>
          <div className="flex justify-center">
            <Button to="/donate?purpose=tuition" size="lg" variant="outlineLight">
              Support Nepali School
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
