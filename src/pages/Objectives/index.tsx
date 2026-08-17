import SectionHeader from '../../components/common/SectionHeader';

const objectives = [
  { icon: '🪔', title: 'Preserve Culture & Traditions', description: 'Preserve and promote Nepali culture, traditions, customs, and values for current and future generations in the Marietta community.' },
  { icon: '📖', title: 'Promote Nepali Language Education', description: 'Support Nepali language education through the Nepali School program and encourage linguistic heritage among youth.' },
  { icon: '🤝', title: 'Strengthen Community Relationships', description: 'Build strong, lasting relationships within the Nepali community and foster a welcoming environment for all members.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Support Families & Members', description: 'Provide support, resources, and assistance to families and community members, especially those newly arrived in Marietta.' },
  { icon: '🎭', title: 'Organize Cultural Programs', description: 'Plan and execute cultural events, performances, and programs that celebrate and showcase Nepali heritage.' },
  { icon: '🎓', title: 'Organize Educational Programs', description: 'Facilitate educational workshops, seminars, and opportunities that benefit community members of all ages.' },
  { icon: '🌱', title: 'Support Youth Programs', description: 'Create opportunities for Nepali youth to connect, grow, and develop leadership skills while staying connected to their roots.' },
  { icon: '🙌', title: 'Provide Community Assistance', description: 'Offer help and support to community members during times of need, whether personal, social, or financial.' },
  { icon: '❤️', title: 'Promote Volunteerism', description: 'Encourage and organize volunteer activities that give back to both the Nepali community and the broader Marietta area.' },
  { icon: '🌐', title: 'Create Community Engagement Opportunities', description: 'Build platforms for community members to engage, network, and collaborate for mutual growth and development.' },
];

export default function Objectives() {
  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Objectives</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            The guiding principles and goals that shape everything we do as a community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="What We Stand For"
          subtitle="Our objectives reflect our commitment to community, culture, education, and service."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj, i) => (
            <div
              key={obj.title}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl" role="img" aria-label={obj.title}>{obj.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#C41E3A] bg-red-50 px-2 py-0.5 rounded-full">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{obj.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{obj.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
