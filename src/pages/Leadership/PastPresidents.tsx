import { Link } from 'react-router-dom';
import { pastPresidents } from '../../data/mockData';
import SectionHeader from '../../components/common/SectionHeader';
import PageHero from '../../components/common/PageHero';

export default function PastPresidents() {
  return (
    <>
      <PageHero title="Past Presidents" subtitle="Honoring the leaders who built and shaped our community." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link to="/leadership/president" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">President</Link>
          <Link to="/leadership" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">Executive Committee</Link>
          <span className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg cursor-default">Past Presidents</span>
        </div>

        <SectionHeader title="Our Past Presidents" subtitle="Recognizing the dedicated leaders of Marietta Nepali Samaj." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastPresidents.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex gap-5 items-start">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-saffron/10">
                <img src={p.photo} alt={p.name} loading="lazy" className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <h3 className="text-lg text-ink">{p.name}</h3>
                <p className="text-sm text-saffron font-semibold mt-0.5">President</p>
                <p className="text-sm text-gray-500 mt-0.5">Term: {p.term}</p>
                {p.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{p.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
