import Button from '../../components/common/Button';
import SectionHeader from '../../components/common/SectionHeader';
import { schoolImage } from '../../data/mockData';

export default function School() {
  return (
    <>
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={schoolImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#f87171] text-sm font-semibold uppercase tracking-wider mb-3">🎓 Education & Culture</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nepali School</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Teaching our children the language, culture, and values of Nepal.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-sm font-semibold text-[#C41E3A] uppercase tracking-wider mb-3">About the School</p>
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
                { label: 'Ages', value: '5–16 years' },
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
        <section className="mb-20 border-l-4 border-[#C41E3A] pl-6 bg-red-50 rounded-r-xl py-5 pr-5">
          <h3 className="font-bold text-gray-900 mb-2">📸 Photo & Media Policy</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We respect the privacy of all students and families. Photographs of school activities are shared only with appropriate consent. We do not publicly display student personal information such as home addresses, phone numbers, or birth dates. Parents may opt out of photography at any time by notifying a school administrator.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-[#C41E3A] to-[#a01830] rounded-2xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-3">Give Your Child the Gift of Their Heritage</h2>
          <p className="text-red-100 mb-8 max-w-xl mx-auto">
            Enroll your child in the Marietta Nepali School today and help them stay connected to the beautiful culture and language of Nepal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/contact" variant="outline" className="border-white text-white hover:bg-white hover:text-[#C41E3A]">Contact to Enroll</Button>
            <Button to="/donate?purpose=school" className="bg-white text-[#C41E3A] hover:bg-red-50">Support the School</Button>
          </div>
        </div>
      </div>
    </>
  );
}
