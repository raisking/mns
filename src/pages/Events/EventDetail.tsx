import { useParams, Link } from 'react-router-dom';
import { mockEvents } from '../../data/mockData';
import Button from '../../components/common/Button';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const event = mockEvents.find(e => e.slug === slug);

  if (!event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-6xl mb-4">😕</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Event Not Found</h2>
        <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button to="/events" variant="primary">View All Events</Button>
      </div>
    );
  }

  return (
    <>
      {/* Cover image header */}
      {event.coverImage && (
        <div className="relative h-72 md:h-96 overflow-hidden bg-gray-900">
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 px-6 max-w-4xl mx-auto">
            <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-3 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Events
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!event.coverImage && (
          <>
            <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-saffron mb-4 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Events
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>
          </>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">About This Event</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            {event.donationUrl && (
              <div className="bg-gradient-to-r from-saffron to-saffron-dark rounded-2xl p-6 text-white text-center">
                <h3 className="font-bold text-lg mb-2">Support This Event</h3>
                <p className="text-amber-100 text-sm mb-4">Help us make this event a success with your generous contribution.</p>
                <Button href={event.donationUrl} variant="outline" className="border-white text-white hover:bg-white hover:text-saffron">
                  Donate for This Event
                </Button>
              </div>
            )}
          </div>

          <aside>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-5">
              <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">Event Details</h3>

              <div className="flex gap-3">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-saffron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Date</p>
                  <p className="text-sm text-gray-800 font-medium">{formatDate(event.date)}</p>
                </div>
              </div>

              {event.startTime && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-saffron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Time</p>
                    <p className="text-sm text-gray-800 font-medium">
                      {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-saffron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Location</p>
                  <p className="text-sm text-gray-800 font-medium">{event.location}</p>
                  {event.address && <p className="text-xs text-gray-500 mt-0.5">{event.address}</p>}
                  {event.address && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-saffron hover:underline mt-1 inline-block"
                    >
                      View on Google Maps →
                    </a>
                  )}
                </div>
              </div>

              {event.registrationUrl && (
                <Button href={event.registrationUrl} fullWidth>Register Now</Button>
              )}
              <Button to="/contact" variant="outline" fullWidth>Contact Us</Button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
