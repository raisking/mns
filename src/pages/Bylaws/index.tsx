import { organization } from '../../config/organization';
import SectionHeader from '../../components/common/SectionHeader';
import PageHero from '../../components/common/PageHero';
import Button from '../../components/common/Button';

// Deliberately does NOT invent specific bylaws provisions (term lengths,
// quorum numbers, voting thresholds, amendment procedures) — those are
// real governance rules with real consequences if someone relied on a
// fabricated version. This only names the topic areas bylaws typically
// cover for an org like MNS, and points people at Contact for the actual
// document. Swap this page for the real bylaws (or a PDF link/embed) once
// MNS has one ready to publish.
const topics = [
  { title: 'Purpose & Mission', description: "The organization's stated purpose and the community it serves." },
  { title: 'Membership', description: 'Who is eligible to join, membership types, and how membership is granted or ended.' },
  { title: 'Executive Committee & Officers', description: 'Elected positions, responsibilities, and term lengths.' },
  { title: 'Elections & Voting', description: 'How and when officers are elected, and who is eligible to vote.' },
  { title: 'Meetings', description: 'How regular and general body meetings are called, and quorum requirements.' },
  { title: 'Finances', description: 'How funds are managed, approved, and reported to members.' },
  { title: 'Amendments', description: 'The process for proposing and approving changes to the bylaws.' },
];

export default function Bylaws() {
  return (
    <>
      <PageHero title="Our Bylaws" subtitle="The rules that govern how Marietta Nepali Samaj is structured and run." />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-ink-soft leading-relaxed">
            MNS operates under a set of bylaws that spell out how the organization is governed — from membership and elections to how meetings are run and funds are managed. The full document is available on request; here's an overview of what it covers.
          </p>
        </section>

        <SectionHeader title="What Our Bylaws Cover" subtitle="A general outline — see the full document for exact terms." />
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {topics.map(topic => (
            <div key={topic.title} className="card-lift bg-white rounded-2xl p-6">
              <h3 className="font-bold text-ink mb-2">{topic.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{topic.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Want a Copy of the Full Bylaws?</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">
            Reach out and we'll share the current governing document with you.
          </p>
          <Button
            to={`/contact?subject=general&message=${encodeURIComponent("I'd like a copy of MNS's full bylaws.")}`}
            variant="primary"
          >
            Request a Copy
          </Button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">
          Questions? Email{' '}
          {organization.email && (
            <a href={`mailto:${organization.email}`} className="text-saffron hover:underline">{organization.email}</a>
          )}.
        </p>
      </div>
    </>
  );
}
