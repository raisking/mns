import { Link } from 'react-router-dom';
import { mockEvents, mockPosts, galleryPreviewPhotos, objectives, heroImage, schoolImage } from '../../data/mockData';
import { organization, socialLinks } from '../../config/organization';
import SectionHeader from '../../components/common/SectionHeader';
import EventCard from '../../components/events/EventCard';
import PostCard from '../../components/posts/PostCard';
import Button from '../../components/common/Button';

export default function Home() {
  const upcomingEvents = mockEvents.filter(e => e.status === 'published').slice(0, 3);

  return (
    <>
      {/* Hero — bottom edge cut into the shallow twin-pennant notch that is
          this site's signature shape, echoing Nepal's flag silhouette. */}
      <section
        className="pennant-edge relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden"
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
          <div className="inline-flex items-center gap-2 bg-ink/60 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-marigold flex-shrink-0" aria-hidden="true" />
            स्वागत छ · Welcome to Marietta, Georgia
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight mb-6 drop-shadow-lg">
            Welcome to<br />
            <span className="text-marigold">{organization.name}</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            {organization.tagline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/about" size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ink">
              Explore Our Community
            </Button>
            <Button to="/donate" size="lg" variant="accent">
              Donate
            </Button>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-crimson uppercase tracking-wider mb-3">Who We Are</p>
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
              {objectives.map((obj, i) => (
                <div key={obj.title} className="card-lift bg-paper-deep rounded-2xl p-5 relative overflow-hidden">
                  <span className={`absolute top-0 left-0 right-0 h-1 ${i % 2 === 0 ? 'bg-crimson' : 'bg-indigo'}`} aria-hidden="true" />
                  <span className="text-3xl mb-3 block" role="img" aria-label={obj.title}>{obj.icon}</span>
                  <h3 className="text-ink mb-1">{obj.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{obj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-20 bg-paper-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
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

      {/* Nepali School */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={schoolImage}
                  alt="Nepali School students learning"
                  loading="lazy"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 rounded-xl p-3 shadow">
                    <p className="text-sm font-bold text-ink">🎓 Nepali Language & Culture</p>
                    <p className="text-xs text-ink-soft mt-0.5">Teaching the next generation their heritage</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-sm font-semibold text-crimson uppercase tracking-wider mb-3">Nepali School</p>
              <h2 className="text-3xl md:text-4xl text-ink mb-6">
                Preserving Language & Culture for Future Generations
              </h2>
              <p className="text-ink-soft leading-relaxed mb-6">
                Our Nepali School provides Nepali language education, cultural programs, and community values to children in the Marietta area. We believe that our children are the future of our culture.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Nepali language reading and writing',
                  'Cultural traditions and values',
                  "Children's programs and activities",
                  'Cultural dance and music',
                  'Community service and volunteering',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-ink-soft">
                    <svg className="w-5 h-5 text-crimson flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Button to="/nepali-school" variant="primary">Learn About Our School</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor & Advertise CTA — indigo, the flag's border color, giving
          this CTA its own identity apart from the crimson donation CTA. */}
      <section className="py-14 md:py-16 bg-indigo text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl mb-5">Sponsor & Advertise With Us</h2>
          <p className="text-white/80 leading-relaxed max-w-2xl mx-auto mb-2">
            Showcase your name or business to the Marietta Nepali community while supporting the programs that bring us together.
          </p>
          <p className="text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
            Flexible sponsorship packages are available on a quarterly, semi-annual, or annual basis. Contact us to learn more about visibility and rates.
          </p>
          <Button to="/contact" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo">
            Contact Us
          </Button>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 md:py-20 bg-paper-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Latest Posts"
            subtitle="Updates and moments shared from our Facebook community."
          />
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {mockPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center">
            <Button href={socialLinks.facebook} variant="outline">
              Follow Us on Facebook
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 md:py-20 bg-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
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
            <Button to="/gallery" variant="outline" className="border-white text-white hover:bg-white hover:text-ink">
              View All Albums
            </Button>
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-crimson to-crimson-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-4 block" role="img" aria-label="Heart">❤️</span>
          <h2 className="text-3xl md:text-4xl mb-4">Support Our Community</h2>
          <p className="text-lg text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your generosity helps us continue our cultural programs, educational initiatives, and community events. Every contribution makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/donate" size="lg" variant="accent">
              Donate Now
            </Button>
            <Button to="/donate?purpose=school" size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-crimson">
              Support Nepali School
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
