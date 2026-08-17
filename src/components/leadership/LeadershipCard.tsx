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
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="p-8 flex flex-col justify-center">
          <span className="text-sm font-semibold text-[#C41E3A] uppercase tracking-wider">{member.position}</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-3">{member.name}</h3>
          {member.bio && <p className="text-gray-600 leading-relaxed">{member.bio}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-red-100">
        <img
          src={member.photo || '/placeholder-person.jpg'}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-bold text-gray-900 text-base">{member.name}</h3>
      <p className="text-sm text-[#C41E3A] font-medium mt-1">{member.position}</p>
      {member.bio && <p className="text-sm text-gray-500 mt-2 line-clamp-3">{member.bio}</p>}
    </div>
  );
}
