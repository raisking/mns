import SectionHeader from '../../components/common/SectionHeader';
import PageHero from '../../components/common/PageHero';
import Button from '../../components/common/Button';
import { organization } from '../../config/organization';
import { communityImage, founders } from '../../data/mockData';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function About() {
  usePageMeta({
    title: 'About Us',
    description: "Learn about Marietta Nepali Samaj's mission, vision, history, and founding members — a nonprofit uniting Nepali families in Marietta, Georgia.",
    path: '/about',
  });
  return (
    <>
      <PageHero title="About Us" subtitle="Learn about our community, history, mission, and vision." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Who We Are */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-sm font-semibold text-saffron uppercase tracking-wider mb-3">Who We Are</p>
            <h2 className="text-3xl text-ink mb-6">A Vibrant Nepali Community in Marietta, Georgia</h2>
            <p className="text-ink-soft leading-relaxed mb-4">
              {organization.name} is a nonprofit community organization that brings together Nepali families, professionals, and students living in the Marietta and greater Atlanta area of Georgia.
            </p>
            <p className="text-ink-soft leading-relaxed mb-4">
              Founded with the goal of preserving Nepali culture and building a strong sense of community, we organize festivals, educational programs, social gatherings, and volunteer initiatives throughout the year.
            </p>
            <p className="text-ink-soft leading-relaxed">
              We welcome all Nepali-speaking individuals and anyone who appreciates Nepali culture to join our growing community.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={communityImage} alt="Marietta Nepali Samaj community members" className="w-full h-80 object-cover" />
          </div>
        </section>

        {/* Mission & Vision */}
        <section id="mission" className="mb-20 scroll-mt-24">
          <SectionHeader title="Mission & Vision" subtitle="What drives us and where we are headed." />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-saffron text-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-amber-100 leading-relaxed">
                To unite and empower the Nepali community in Marietta, Georgia by preserving our cultural heritage, promoting Nepali language education, supporting community members, and fostering strong bonds among families and individuals.
              </p>
            </div>
            <div className="bg-himal text-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-blue-100 leading-relaxed">
                A thriving, connected Nepali community where every member feels at home, where our culture is celebrated and passed to future generations, and where we contribute positively to the broader Marietta community.
              </p>
            </div>
          </div>
        </section>

        {/* History */}
        <section id="history" className="mb-20 scroll-mt-24">
          <SectionHeader title="Our History" subtitle="How Marietta Nepali Samaj came to be." />
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                { year: '2010', title: 'Foundation', description: 'A small group of Nepali families in Marietta came together to form an informal community group, celebrating Dashain and Tihar together for the first time.' },
                { year: '2012', title: 'Official Organization', description: 'Marietta Nepali Samaj was formally established as a nonprofit organization with elected leadership and a constitution.' },
                { year: '2015', title: 'Nepali School Founded', description: 'The Nepali School was established to provide Nepali language and cultural education to the children of community members.' },
                { year: '2018', title: 'Community Growth', description: 'Membership grew significantly as the Nepali community in the Marietta area expanded. Major festivals began attracting hundreds of attendees.' },
                { year: '2024', title: 'Today', description: 'MNS continues to serve hundreds of families across Marietta and the greater Atlanta area with regular events, school programs, and community services.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-saffron text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.year.slice(2)}
                    </div>
                    {i < 4 && <div className="w-0.5 bg-amber-200 flex-1 mt-2" />}
                  </div>
                  <div className="pb-8">
                    <p className="text-sm text-saffron font-semibold mb-1">{item.year}</p>
                    <h3 className="text-ink text-lg mb-2">{item.title}</h3>
                    <p className="text-ink-soft leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Founding Members — invented placeholder names, same convention
              as every other roster in mockData.ts (see the comment above
              the `founders` export). Swap for the real names once known. */}
          <div className="max-w-5xl mx-auto mt-16">
            <h3 className="text-xl text-ink mb-2 text-center">Our Founding Members</h3>
            <p className="text-sm text-ink-soft text-center mb-8">The community members who brought MNS together in 2010.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {founders.map(founder => (
                <div key={founder.id} className="card-lift bg-paper-deep rounded-2xl p-6 text-center">
                  {founder.photo && (
                    <img
                      src={founder.photo}
                      alt={founder.name}
                      loading="lazy"
                      className="w-20 h-20 rounded-full object-cover object-top mx-auto mb-4 ring-4 ring-saffron/10"
                    />
                  )}
                  <h4 className="text-ink">{founder.name}</h4>
                  <p className="text-sm text-saffron font-semibold mt-0.5">{founder.position}</p>
                  {founder.bio && <p className="text-xs text-ink-soft mt-2 leading-relaxed">{founder.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Activities */}
        <section>
          <SectionHeader title="Community Activities" subtitle="What we do throughout the year." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Cultural Festivals', desc: 'Annual celebrations of Dashain, Tihar, Nepali New Year, Teej, and other cultural festivals.' },
              { title: 'Educational Programs', desc: 'Nepali School, tutoring support, scholarship programs, and educational workshops.' },
              { title: 'Cultural Programs', desc: 'Dance performances, music programs, cultural showcases, and talent shows.' },
              { title: 'Community Events', desc: 'Annual summer picnic, community dinners, sports tournaments, and social gatherings.' },
              { title: 'Volunteer Programs', desc: 'Community service initiatives, helping those in need, and giving back to Marietta.' },
              { title: 'Family Support', desc: 'New member welcome programs, community networking, and family support services.' },
            ].map(item => (
              <div key={item.title} className="card-lift bg-paper-deep rounded-2xl p-6">
                <h3 className="text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button to="/contact" variant="outline">Get Involved</Button>
          </div>
        </section>
      </div>
    </>
  );
}
