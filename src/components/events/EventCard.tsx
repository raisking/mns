import { Link } from 'react-router-dom';
import type { Event } from '../../types/Event';

interface EventCardProps {
  event: Event;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = date.getDate();

  return (
    <article className="card-lift bg-white rounded-2xl overflow-hidden group">
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
            <span className="text-4xl">🎉</span>
          </div>
        )}
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white rounded-xl shadow-md text-center px-3 py-2 min-w-[3.5rem]">
          <p className="text-[10px] font-bold text-saffron tracking-wider">{month}</p>
          <p className="text-xl font-bold text-ink leading-none">{day}</p>
        </div>
        {event.status === 'completed' && (
          <div className="absolute top-3 right-3 bg-ink text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Past Event
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg leading-tight mb-2 line-clamp-2 text-ink">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <svg className="w-4 h-4 text-saffron flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.date)}</span>
          </div>
          {event.startTime && (
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <svg className="w-4 h-4 text-saffron flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <svg className="w-4 h-4 text-saffron flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <p className="text-sm text-ink-soft line-clamp-2 mb-4">{event.description}</p>

        <Link
          to={`/events/${event.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron hover:gap-2.5 transition-all"
        >
          View Details
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
