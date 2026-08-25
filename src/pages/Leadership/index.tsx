import { Link } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader';
import PageHero from '../../components/common/PageHero';
import LeadershipCard from '../../components/leadership/LeadershipCard';
import { executiveCommittee } from '../../data/mockData';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function Leadership() {
  usePageMeta({
    title: 'Our Leadership',
    description: 'Meet the Executive Committee and leadership guiding Marietta Nepali Samaj.',
    path: '/leadership',
  });
  return (
    <>
      <PageHero title="Our Leadership" subtitle="Meet the dedicated individuals who guide and serve our community." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick nav */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link to="/leadership/president" className="px-5 py-2.5 bg-himal text-white text-sm font-semibold rounded-lg hover:bg-himal-dark transition-colors">
            President
          </Link>
          <span className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg cursor-default">
            Executive Committee
          </span>
          <Link to="/leadership/past-presidents" className="px-5 py-2.5 bg-white border-2 border-ink-soft/15 text-ink-soft text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">
            Past Presidents
          </Link>
          <Link to="/leadership/committee-archive" className="px-5 py-2.5 bg-white border-2 border-ink-soft/15 text-ink-soft text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">
            Committee Archive
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
