import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import SectionHeader from '../../components/common/SectionHeader';
import PageHero from '../../components/common/PageHero';
import { schoolImage } from '../../data/mockData';

const subjects = [
  { icon: '🔤', title: 'Nepali Language', desc: 'Reading, writing, and speaking Nepali — from the alphabet to full sentences.' },
  { icon: '🎭', title: 'Cultural Traditions', desc: 'Festivals, customs, rituals, and the stories that make Nepal unique.' },
  { icon: '🎵', title: 'Music & Dance', desc: 'Traditional Nepali songs, folk music, and cultural dances.' },
  { icon: '📜', title: 'History & Geography', desc: "Nepal's rich history, geography, and its place in the world." },
  { icon: '🙏', title: 'Values & Character', desc: 'Respect, kindness, community spirit, and Nepali values.' },
  { icon: '🎨', title: 'Arts & Crafts', desc: 'Traditional Nepali art forms, crafts, and creative expression.' },
];

const scheduleRows = [
  { label: 'Day', value: 'Every Sunday' },
  { label: 'Time', value: '10:00 AM – 12:00 PM' },
  { label: 'Location', value: 'Marietta Community Center' },
  { label: 'Ages', value: '3-16 years' },
  { label: 'Language', value: 'Nepali' },
  { label: 'Cost', value: 'Free for community members' },
];

export default function School() {
  return (
    <>
      <PageHero
        eyebrow="🎓 Education & Culture"
        title="Nepali School"
        subtitle="Building a bridge between two worlds — teaching the language, culture, and values of Nepal to the next generation."
        image={schoolImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick nav */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <span className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg cursor-default">Nepali School</span>
          <Link to="/nepali-school/team" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">Meet Our Team</Link>
        </div>

        {/* About / narrative */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">नेपाली पाठशाला · About the School</p>
            <h2 className="text-3xl md:text-4xl text-ink mb-6">Building a Bridge Between Two Worlds</h2>
            <p className="text-ink-soft leading-relaxed mb-4">
              The Marietta Nepali School, operated by Marietta Nepali Samaj, provides Nepali language education and cultural programs to children of Nepali families living in Marietta and surrounding areas.
            </p>
            <p className="text-ink-soft leading-relaxed mb-4">
              Our school meets every Sunday with dedicated volunteer teachers who are passionate about passing on our language, traditions, and values to the next generation.
            </p>
            <p className="text-ink-soft leading-relaxed mb-8">
              We believe that children who stay connected to their cultural roots grow up with a stronger sense of identity, pride, and belonging.
            </p>
            <Button to="/contact" variant="outline">Enroll Your Child</Button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={schoolImage} alt="Students at Marietta Nepali School working together in class" className="w-full h-80 object-cover" />
          </div>
        </section>
      </div>

      {/* What We Teach — full-bleed band for rhythm against the white
          narrative section above and below. */}
      <section className="py-16 md:py-20 bg-paper-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="What We Teach" subtitle="A well-rounded Nepali education for our children." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((item, i) => (
              <div key={item.title} className="card-lift bg-white rounded-2xl p-6 relative overflow-hidden">
                <span className={`absolute top-0 left-0 right-0 h-1 ${i % 2 === 0 ? 'bg-saffron' : 'bg-indigo'}`} aria-hidden="true" />
                <span className="text-3xl mb-3 block" role="img" aria-label={item.title}>{item.icon}</span>
                <h3 className="font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Schedule + Photo policy, side by side so two logistics blocks
            don't just stack full-width one after another. */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 items-stretch">
          <section className="bg-paper-deep rounded-2xl p-8">
            <h3 className="text-xl font-bold text-ink mb-6">School Schedule</h3>
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              {scheduleRows.map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-semibold text-ink-soft">{row.label}</span>
                  <span className="text-sm text-ink font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="border-l-4 border-saffron pl-6 bg-amber-50 rounded-r-xl py-6 pr-6">
            <h3 className="font-bold text-ink mb-2">
              <span aria-hidden="true">📸</span> Photo & Media Policy
            </h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              We respect the privacy of all students and families. Photographs of school activities are shared only with appropriate consent. We do not publicly display student personal information such as home addresses, phone numbers, or birth dates. Parents may opt out of photography at any time by notifying a school administrator.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-saffron to-saffron-dark rounded-2xl p-10 md:p-14 text-white">
          <span className="text-4xl mb-4 block" role="img" aria-label="Graduation cap">🎓</span>
          <p className="text-marigold text-sm font-semibold uppercase tracking-wider mb-3">सहयोग · Support</p>
          <h2 className="text-2xl md:text-3xl mb-4">Give Your Child the Gift of Their Heritage</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
            Enroll your child in the Marietta Nepali School today and help them stay connected to the beautiful culture and language of Nepal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/contact" size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-saffron">Contact to Enroll</Button>
            <Button to="/donate?purpose=school" size="lg" variant="light">Support the School</Button>
          </div>
        </div>
      </div>
    </>
  );
}
