import { Link } from 'react-router-dom';
import { executiveCommitteeArchive } from '../../data/mockData';
import SectionHeader from '../../components/common/SectionHeader';
import PageHero from '../../components/common/PageHero';
import LeadershipCard from '../../components/leadership/LeadershipCard';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function CommitteeArchive() {
  usePageMeta({
    title: 'Committee Archive',
    description: 'Full Executive Committee rosters from past terms of Marietta Nepali Samaj.',
    path: '/leadership/committee-archive',
  });
  return (
    <>
      <PageHero title="Committee Archive" subtitle="Full Executive Committee rosters from past terms, not just the President." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link to="/leadership/president" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">President</Link>
          <Link to="/leadership" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">Executive Committee</Link>
          <Link to="/leadership/past-presidents" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">Past Presidents</Link>
          <span className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg cursor-default">Committee Archive</span>
        </div>

        <SectionHeader title="Executive Committee, By Term" subtitle="Every officer who has served, term by term." />

        <div className="space-y-16">
          {executiveCommitteeArchive.map(({ term, members }) => (
            <section key={term}>
              <h3 className="text-xl font-bold text-ink mb-6 text-center">{term}</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {members.map(member => (
                  <LeadershipCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
