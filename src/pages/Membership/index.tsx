import { useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import PageHero from '../../components/common/PageHero';
import Button from '../../components/common/Button';

// Only benefits that are already real/verifiable elsewhere in the app —
// the $200 member vs. $250 non-member tuition split lives in the School
// page's fee toggle (src/pages/School/index.tsx). "Vote/run for the
// Executive Committee" is standard practice for Nepali community
// associations generally (mirrors peer orgs like the Nepalese Association
// of Georgia) but isn't confirmed against MNS's own bylaws — check that
// before this copy ships for real.
const benefits = [
  {
    title: 'Discounted Nepali School Tuition',
    description: 'MNS members pay $200/semester for the Nepali School, compared to $250 for non-members.',
  },
  {
    title: 'A Voice in Leadership',
    description: 'Members are eligible to vote and run for a seat on the Executive Committee.',
  },
  {
    title: 'Event Updates & Access',
    description: 'Stay in the loop on Dashain, Tihar, the summer picnic, and every other gathering on our calendar.',
  },
  {
    title: 'Community Belonging',
    description: 'Connect with Nepali families across Marietta and build lasting friendships rooted in a shared culture.',
  },
];

// Placeholder pricing, per explicit request — MNS hasn't finalized real
// dues amounts yet. Swap the numbers below once the board confirms actual
// figures; nothing else about the page (the radio-group pattern, the
// /donate handoff) needs to change when that happens. Modeled on peer
// Nepali community associations' tier structure (individual / individual
// lifetime / family lifetime), not copied pricing from any of them.
type TierId = 'individual' | 'individual-life' | 'family-life';

const tiers: { id: TierId; name: string; price: number; period: string; badge?: string }[] = [
  { id: 'individual', name: 'Individual', price: 25, period: 'per year' },
  { id: 'individual-life', name: 'Individual Life', price: 150, period: 'one-time' },
  { id: 'family-life', name: 'Family Life', price: 250, period: 'one-time', badge: 'Best Value' },
];

const membershipMessage = "I have a question about becoming a member of Marietta Nepali Samaj:";

export default function Membership() {
  // Defaults to Family Life since that's the one badged "Best Value" —
  // same reasoning School's fee picker uses for defaulting to the member
  // rate.
  const [selectedTier, setSelectedTier] = useState<TierId>('family-life');
  const tier = tiers.find(t => t.id === selectedTier)!;

  return (
    <>
      <PageHero
        eyebrow="सदस्यता · Membership"
        title="Become a Member"
        subtitle="Membership is about identity, connection, and strength — join a community preserving Nepali culture and supporting families across Marietta."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-ink-soft leading-relaxed">
            Membership is how our community sustains itself — it connects families, funds our programs, and keeps traditions alive for the next generation. Pick the option that fits you below.
          </p>
        </section>

        {/* Membership Options — same select-a-rate-then-continue-to-payment
            pattern as the School page's Tuition & Fees section. No live
            payment processor exists yet (see Donate's own comment on
            handleDonate), so continuing still shows a placeholder alert
            rather than actually charging anything. */}
        <section className="mb-20">
          <h3 className="text-xl font-bold text-ink mb-2 text-center">Membership Options</h3>
          <p className="text-sm text-ink-soft text-center mb-8">Select a membership type to continue to payment.</p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8" role="radiogroup" aria-label="Membership type">
            {tiers.map(t => (
              <label key={t.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="membership-tier"
                  checked={selectedTier === t.id}
                  onChange={() => setSelectedTier(t.id)}
                  className="sr-only"
                />
                <div
                  className={`relative rounded-xl shadow-sm p-6 text-center border-2 transition-all ${
                    selectedTier === t.id ? 'border-saffron bg-amber-50 ring-2 ring-saffron' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  {t.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-saffron text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm">
                      {t.badge}
                    </span>
                  )}
                  <p className={`text-sm font-semibold uppercase tracking-wide mb-2 ${selectedTier === t.id ? 'text-saffron' : 'text-ink-soft'}`}>
                    {t.name}
                  </p>
                  <p className="text-3xl font-display font-bold text-ink">${t.price}</p>
                  <p className="text-sm text-ink-soft mt-1">{t.period}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Carries the selected tier's amount to Donate/Payment as
              ?amount=, and purpose=membership so the purpose dropdown lands
              on "Membership Dues" rather than General Fund. */}
          <div className="flex justify-center">
            <Button to={`/donate?purpose=membership&amount=${tier.price}`} variant="primary" size="lg">
              Join & Pay (${tier.price}) →
            </Button>
          </div>
        </section>

        <SectionHeader title="Why Join" subtitle="A few of the ways membership supports you and our community." />
        <div className="grid sm:grid-cols-2 gap-6 mb-20">
          {benefits.map(item => (
            <div key={item.title} className="card-lift bg-white rounded-2xl p-6">
              <h3 className="font-bold text-ink mb-2">{item.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA — same saffron-gradient banner pattern as School's closing CTA */}
        <div className="text-center bg-gradient-to-br from-saffron to-saffron-dark rounded-2xl p-10 md:p-14 text-white">
          <p className="text-marigold text-sm font-semibold uppercase tracking-wider mb-3">सदस्यता · Join Us</p>
          <h2 className="text-2xl md:text-3xl mb-4">Have Questions About Membership?</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
            Reach out and we'll walk you through the details before you commit to anything.
          </p>
          <Button
            to={`/contact?subject=membership&message=${encodeURIComponent(membershipMessage)}`}
            size="lg"
            variant="light"
          >
            Ask a Question
          </Button>
        </div>
      </div>
    </>
  );
}
