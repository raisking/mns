import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import SectionHeader from '../../components/common/SectionHeader';
import PageHero from '../../components/common/PageHero';
import { schoolImage } from '../../data/mockData';

export default function School() {
  return (
    <>
      <PageHero
        eyebrow="🎓 Education & Culture"
        title="Nepali School"
        subtitle="Teaching our children the language, culture, and values of Nepal."
        image={schoolImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick nav */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <span className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg cursor-default">School Overview</span>
          <Link to="/nepali-school/about" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-crimson hover:text-crimson transition-colors">About the School</Link>
          <Link to="/nepali-school/team" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-crimson hover:text-crimson transition-colors">Meet Our Team</Link>
        </div>

        {/* What We Teach */}
        <section className="mb-20">
          <SectionHeader title="What We Teach" subtitle="A well-rounded Nepali education for our children." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔤', title: 'Nepali Language', desc: 'Reading, writing, and speaking Nepali — from the alphabet to full sentences.' },
              { icon: '🎭', title: 'Cultural Traditions', desc: 'Festivals, customs, rituals, and the stories that make Nepal unique.' },
              { icon: '🎵', title: 'Music & Dance', desc: 'Traditional Nepali songs, folk music, and cultural dances.' },
              { icon: '📜', title: 'History & Geography', desc: "Nepal's rich history, geography, and its place in the world." },
              { icon: '🙏', title: 'Values & Character', desc: 'Respect, kindness, community spirit, and Nepali values.' },
              { icon: '🎨', title: 'Arts & Crafts', desc: 'Traditional Nepali art forms, crafts, and creative expression.' },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Schedule */}
        <section className="mb-20 bg-gray-50 rounded-2xl p-8 md:p-12">
          <SectionHeader title="School Schedule" subtitle="Join us every Sunday for classes." />
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              {[
                { label: 'Day', value: 'Every Sunday' },
                { label: 'Time', value: '10:00 AM – 12:00 PM' },
                { label: 'Location', value: 'Marietta Community Center' },
                { label: 'Ages', value: '3-16 years' },
                { label: 'Language', value: 'Nepali' },
                { label: 'Cost', value: 'Free for community members' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-semibold text-gray-600">{row.label}</span>
                  <span className="text-sm text-gray-900 font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media consent notice */}
        <section className="mb-20 border-l-4 border-crimson pl-6 bg-red-50 rounded-r-xl py-5 pr-5">
          <h3 className="font-bold text-gray-900 mb-2">📸 Photo & Media Policy</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We respect the privacy of all students and families. Photographs of school activities are shared only with appropriate consent. We do not publicly display student personal information such as home addresses, phone numbers, or birth dates. Parents may opt out of photography at any time by notifying a school administrator.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-crimson to-crimson-dark rounded-2xl p-10 md:p-14 text-white">
          <span className="text-4xl mb-4 block" role="img" aria-label="Graduation cap">🎓</span>
          <p className="text-marigold text-sm font-semibold uppercase tracking-wider mb-3">सहयोग · Support</p>
          <h2 className="text-2xl md:text-3xl mb-4">Give Your Child the Gift of Their Heritage</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
            Enroll your child in the Marietta Nepali School today and help them stay connected to the beautiful culture and language of Nepal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/contact" size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-crimson">Contact to Enroll</Button>
            <Button to="/donate?purpose=school" size="lg" variant="light">Support the School</Button>
          </div>
        </div>
      </div>
    </>
  );
}
