import type { LeadershipMember } from '../../types/Leadership';

interface LeadershipCardProps {
  member: LeadershipMember;
  featured?: boolean;
}

export default function LeadershipCard({ member, featured = false }: LeadershipCardProps) {
  if (featured) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row gap-0 max-w-2xl mx-auto">
        <div className="md:w-64 flex-shrink-0">
          <img
            src={member.photo || '/placeholder-person.jpg'}
            alt={member.name}
            // object-top — see the circular avatar below for why.
            className="w-full h-64 md:h-full object-cover object-top"
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

  // Plain static card — bio (if any) shows in full, always. Previously this
  // branch was a button that truncated the bio to 3 lines and revealed the
  // rest in a hover/tap overlay; removed by request since it added an
  // interaction that, for most of the bios actually in use, just
  // re-displayed the same text a second time (nothing was long enough to
  // truncate in the first place).
  return (
    <div className="card-lift bg-white rounded-2xl p-6 text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-saffron/10">
        <img
          src={member.photo || '/placeholder-person.jpg'}
          alt={member.name}
          loading="lazy"
          // object-top, not center: these are portrait source photos
          // (e.g. 400x600) cropped into a 1:1 circle. Centered cover
          // crops equally off the top and bottom, and these photos have
          // little headroom above the hair — center cropping clips it.
          // Anchoring to the top crops the excess from the bottom
          // (shoulders/chest) instead, which is always safe to lose.
          className="w-full h-full object-cover object-top"
        />
      </div>
      <h3 className="text-base text-ink">{member.name}</h3>
      <p className="text-sm text-saffron font-medium mt-1">{member.position}</p>
      {member.bio && <p className="text-sm text-ink-soft/80 mt-2 leading-relaxed">{member.bio}</p>}
    </div>
  );
}
