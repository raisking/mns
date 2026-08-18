import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import LeadershipCard from '../../components/leadership/LeadershipCard';
import { schoolImage, schoolStaff } from '../../data/mockData';

const principal = schoolStaff.find(s => s.category === 'Principal');
const teachers = schoolStaff.filter(s => s.category === 'Teacher');
const volunteers = schoolStaff.filter(s => s.category === 'Volunteer');

export default function SchoolTeam() {
  return (
    <>
      <PageHero
        eyebrow="🎓 Education & Culture"
        title="Meet Our Team"
        subtitle="The principal, teachers, and volunteers who make Nepali School possible every Sunday."
        image={schoolImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick nav */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link to="/nepali-school" className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-saffron hover:text-saffron transition-colors">Nepali School</Link>
          <span className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-lg cursor-default">Meet Our Team</span>
        </div>

        {principal && (
          <div className="mb-12">
            <LeadershipCard member={principal} featured />
          </div>
        )}

        {teachers.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Teachers</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map(teacher => (
                <LeadershipCard key={teacher.id} member={teacher} />
              ))}
            </div>
          </div>
        )}

        {volunteers.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Volunteers</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteers.map(volunteer => (
                <LeadershipCard key={volunteer.id} member={volunteer} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
