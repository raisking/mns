import { useState } from 'react';
import { mockEvents } from '../../data/mockData';
import EventCard from '../../components/events/EventCard';
import EmptyState from '../../components/common/EmptyState';

type Tab = 'upcoming' | 'past';

export default function Events() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const upcoming = mockEvents.filter(e => e.status === 'published');
  const past = mockEvents.filter(e => e.status === 'completed');
  const events = activeTab === 'upcoming' ? upcoming : past;

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Upcoming celebrations, programs, and community gatherings.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl max-w-xs mx-auto mb-12">
          {(['upcoming', 'past'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'upcoming' ? 'Upcoming' : 'Past'} Events
            </button>
          ))}
        </div>

        {events.length === 0 ? (
          <EmptyState
            icon={activeTab === 'upcoming' ? '📅' : '📷'}
            title={activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
            message={
              activeTab === 'upcoming'
                ? 'No upcoming events are currently scheduled. Please check back soon.'
                : 'No past events to display yet.'
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
