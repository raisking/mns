import { useState } from 'react';
import type { LeadershipMember } from '../../types/Leadership';

interface LeadershipCardProps {
  member: LeadershipMember;
  featured?: boolean;
}

export default function LeadershipCard({ member, featured = false }: LeadershipCardProps) {
  const [revealed, setRevealed] = useState(false);

  if (featured) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row gap-0 max-w-2xl mx-auto">
        <div className="md:w-64 flex-shrink-0">
          <img
            src={member.photo || '/placeholder-person.jpg'}
            alt={member.name}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="p-8 flex flex-col justify-center">
          <span className="text-sm font-semibold text-saffron uppercase tracking-wider">{member.position}</span>
          <h3 className="text-2xl mt-1 mb-3 text-ink">{member.name}</h3>
          {member.bio && <p className="text-ink-soft leading-relaxed">{member.bio}</p>}
        </div>
      </div>
    );
  }

  // Bio is truncated to 3 lines below — the full bio reveals on hover as an
  // overlay sized to the card's own fixed footprint (absolute + inset-0),
  // so it never pushes sibling cards around in the grid. Hover alone isn't
  // reachable on touch or via keyboard, so the card is also a real button
  // that toggles the same reveal on tap/Enter/Space.
  if (!member.bio) {
    return (
      <div className="card-lift bg-white rounded-2xl p-6 text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-saffron/10">
          <img
            src={member.photo || '/placeholder-person.jpg'}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-base text-ink">{member.name}</h3>
        <p className="text-sm text-saffron font-medium mt-1">{member.position}</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setRevealed(r => !r)}
      aria-expanded={revealed}
      className="card-lift group relative bg-white rounded-2xl p-6 text-center w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-saffron/10">
        <img
          src={member.photo || '/placeholder-person.jpg'}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-base text-ink">{member.name}</h3>
      <p className="text-sm text-saffron font-medium mt-1">{member.position}</p>
      <p className="text-sm text-ink-soft/80 mt-2 line-clamp-3">{member.bio}</p>

      {/* Full-bio overlay — fades in on hover or tap/keyboard toggle.
          Positioned to the button's own bounds, so revealing it never
          shifts layout for the rest of the grid. */}
      {/* aria-hidden unconditionally: line-clamp only clips visually, so the
          truncated <p> above already exposes the full bio text to screen
          readers. Without this, expanding would announce the bio twice. */}
      <div
        className={`absolute inset-0 bg-white p-6 flex flex-col items-center justify-center text-center overflow-y-auto transition-opacity duration-300 ${
          revealed ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
        }`}
        aria-hidden="true"
      >
        <p className="text-sm font-semibold text-saffron uppercase tracking-wide mb-1">{member.position}</p>
        <h3 className="text-base text-ink mb-3">{member.name}</h3>
        <p className="text-sm text-ink-soft leading-relaxed">{member.bio}</p>
      </div>
    </button>
  );
}
