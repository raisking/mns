import { Link } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader';
import LeadershipCard from '../../components/leadership/LeadershipCard';
import { executiveCommittee } from '../../data/mockData';

export default function Leadership() {
  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Leadership</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Meet the dedicated individuals who guide and serve our community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick nav */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link to="/leadership/president" className="px-5 py-2.5 bg-[#C41E3A] text-white text-sm font-semibold rounded-lg hover:bg-[#a01830] transition-colors">
            President
          </Link>
          <span className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg cursor-default">
            Executive Committee
          </span>
          <Link to="/leadership/past-presidents" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-[#C41E3A] hover:text-[#C41E3A] transition-colors">
            Past Presidents
          </Link>
        </div>

        <SectionHeader title="Executive Committee" subtitle="Our elected leaders serving the community." />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {executiveCommittee.map(member => (
            <LeadershipCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </>
  );
}
