import { useState } from 'react';
import { mockEvents } from '../../data/mockData';
import EventCard from '../../components/events/EventCard';
import EmptyState from '../../components/common/EmptyState';
import PageHero from '../../components/common/PageHero';
import { usePageMeta } from '../../hooks/usePageMeta';

type Tab = 'upcoming' | 'past';

export default function Events() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const upcoming = mockEvents.filter(e => e.status === 'published');
  const past = mockEvents.filter(e => e.status === 'completed');
  const events = activeTab === 'upcoming' ? upcoming : past;

  usePageMeta({
    title: 'Events',
    description: 'Upcoming and past events from Marietta Nepali Samaj — festivals, cultural programs, and community gatherings.',
    path: '/events',
  });

  return (
    <>
      <PageHero title="Events" subtitle="Upcoming celebrations, programs, and community gatherings." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-paper-deep rounded-xl max-w-xs mx-auto mb-12">
          {(['upcoming', 'past'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {tab === 'upcoming' ? 'Upcoming' : 'Past'} Events
            </button>
          ))}
        </div>

        {events.length === 0 ? (
          <EmptyState
            title={activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
            message={
              activeTab === 'upcoming'
                ? 'No upcoming events are currently scheduled. Please check back soon.'
                : 'No past events to display yet.'
            }
          />
        ) : (
          <div
            className={`grid gap-6 ${
              events.length === 1 ? 'max-w-sm mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
