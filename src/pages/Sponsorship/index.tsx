import { useState } from 'react';
import PageHero from '../../components/common/PageHero';
import Button from '../../components/common/Button';

// Placeholder pricing, per explicit request — same "invent it now, swap
// real numbers in later" approach used for Membership's tiers. Routed to
// Contact rather than Donate/Payment: a sponsorship is a negotiated deal
// (logo placement, booth space, event mentions), not a fixed one-click
// purchase, so it needs a real conversation before any amount is decided.
type TierId = 'community' | 'festival' | 'presenting';

const tiers: { id: TierId; name: string; price: number; badge?: string; features: string[] }[] = [
  {
    id: 'community',
    name: 'Community Sponsor',
    price: 100,
    features: ['Logo on the MNS website', 'Listed in event programs'],
  },
  {
    id: 'festival',
    name: 'Festival Sponsor',
    price: 500,
    badge: 'Most Popular',
    features: ['Everything in Community', 'Booth space at Dashain & Tihar', 'Shout-out on social media'],
  },
  {
    id: 'presenting',
    name: 'Presenting Sponsor',
    price: 1000,
    features: ['Everything in Festival', 'Logo featured on event banners', 'Recognition from the stage at major events'],
  },
];

const sponsorshipMessage = "My business is interested in sponsoring Marietta Nepali Samaj. Here's a bit about us:";

export default function Sponsorship() {
  const [selectedTier, setSelectedTier] = useState<TierId>('festival');
  const tier = tiers.find(t => t.id === selectedTier)!;

  return (
    <>
      <PageHero
        eyebrow="प्रायोजक · Sponsorship"
        title="Become a Sponsor"
        subtitle="Put your business in front of hundreds of Nepali families across Marietta while supporting the events that bring our community together."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-ink-soft leading-relaxed">
            Our festivals and events draw hundreds of community members every year. Sponsoring MNS puts your business name in front of them — while directly funding the Nepali School, cultural celebrations, and family support programs we run.
          </p>
        </section>

        {/* Sponsorship Tiers — same select-then-continue pattern as
            Membership's tier picker, but the CTA hands off to Contact
            instead of Donate/Payment (see file comment above). */}
        <section className="mb-16">
          <h3 className="text-xl font-bold text-ink mb-2 text-center">Sponsorship Levels</h3>
          <p className="text-sm text-ink-soft text-center mb-8">Select a level to start the conversation.</p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8" role="radiogroup" aria-label="Sponsorship level">
            {tiers.map(t => (
              <label key={t.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="sponsorship-tier"
                  checked={selectedTier === t.id}
                  onChange={() => setSelectedTier(t.id)}
                  className="sr-only"
                />
                <div
                  className={`relative rounded-xl shadow-sm p-6 text-center border-2 transition-all h-full ${
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
                  <p className="text-3xl font-display font-bold text-ink mb-1">${t.price}+</p>
                  <ul className="text-xs text-ink-soft leading-relaxed mt-3 space-y-1 text-left">
                    {t.features.map(f => (
                      <li key={f} className="flex gap-1.5">
                        <span className="text-saffron flex-shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              to={`/contact?subject=sponsorship&message=${encodeURIComponent(`${sponsorshipMessage} — interested in ${tier.name}.`)}`}
              variant="primary"
              size="lg"
            >
              Inquire About Sponsorship →
            </Button>
          </div>
        </section>

        {/* CTA — same saffron-gradient banner pattern as School/Membership/Volunteer's closing CTA */}
        <div className="text-center bg-gradient-to-br from-saffron to-saffron-dark rounded-2xl p-10 md:p-14 text-white">
          <p className="text-marigold text-sm font-semibold uppercase tracking-wider mb-3">प्रायोजक · Partner With Us</p>
          <h2 className="text-2xl md:text-3xl mb-4">Not Sure What Fits?</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
            Every business is different — reach out and we'll build a sponsorship that works for you.
          </p>
          <Button
            to={`/contact?subject=sponsorship&message=${encodeURIComponent(sponsorshipMessage)}`}
            size="lg"
            variant="light"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </>
  );
}
