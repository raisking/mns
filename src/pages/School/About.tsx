import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import PageHero from '../../components/common/PageHero';
import { schoolImage } from '../../data/mockData';

export default function SchoolAbout() {
  return (
    <>
      <PageHero
        eyebrow="🎓 Education & Culture"
        title="About Marietta Nepali School"
        subtitle="Building a bridge between two worlds for the next generation."
        image={schoolImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick nav */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link to="/nepali-school" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">School Overview</Link>
          <span className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg cursor-default">About the School</span>
          <Link to="/nepali-school/team" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">Meet Our Team</Link>
        </div>

        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">About the School</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Building a Bridge Between Two Worlds</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Marietta Nepali School, operated by Marietta Nepali Samaj, provides Nepali language education and cultural programs to children of Nepali families living in Marietta and surrounding areas.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our school meets regularly with dedicated volunteer teachers who are passionate about passing on our language, traditions, and values to the next generation.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              We believe that children who stay connected to their cultural roots grow up with a stronger sense of identity, pride, and belonging.
            </p>
            <Button to="/contact">Enroll Your Child</Button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={schoolImage} alt="Nepali School class" className="w-full h-80 object-cover" />
          </div>
        </section>
      </div>
    </>
  );
}
