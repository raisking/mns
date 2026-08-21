import { Link } from 'react-router-dom';
import { president } from '../../data/mockData';
import Button from '../../components/common/Button';
import PageHero from '../../components/common/PageHero';

export default function President() {
  return (
    <>
      <PageHero eyebrow="Leadership" title="Message from the President" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap gap-3 mb-10">
          <span className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg cursor-default">President</span>
          <Link to="/leadership" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">Executive Committee</Link>
          <Link to="/leadership/past-presidents" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">Past Presidents</Link>
          <Link to="/leadership/committee-archive" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">Committee Archive</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-72 flex-shrink-0">
              <img
                src={president.photo}
                alt={president.name}
                className="w-full h-72 md:h-full object-cover"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-sm font-semibold text-saffron uppercase tracking-wider">{president.position}</span>
              <h2 className="text-3xl mt-2 mb-6 text-ink">{president.name}</h2>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Dear Community Members,
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  It is my great honor to serve as the President of Marietta Nepali Samaj. Our community continues to grow stronger each year, and I am deeply grateful for the trust and support that each of you has given us.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our mission is to preserve our Nepali culture, support our families, and build a vibrant community where everyone feels at home. Whether you are celebrating a festival, sending your children to our Nepali School, or simply meeting fellow Nepalis, MNS is here for you.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  I look forward to serving our community and working together to make Marietta Nepali Samaj an even stronger, more connected, and more prosperous community.
                </p>
                <p className="text-gray-700 font-semibold">Warm regards,<br />{president.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button to="/contact">Contact Us</Button>
        </div>
      </div>
    </>
  );
}
