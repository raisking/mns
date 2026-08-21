import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { donationCategories, donationAmounts } from '../../config/organization';
import SectionHeader from '../../components/common/SectionHeader';

export default function Donate() {
  const [searchParams] = useSearchParams();
  const initialPurpose = searchParams.get('purpose') || 'general';
  // Fee amounts (e.g. the School page's $200/$250 tiers) won't always match
  // one of the suggested donationAmounts presets below — fall back to the
  // custom-amount field for anything that isn't an exact preset match,
  // rather than hardcoding tuition-specific dollar values into what's
  // otherwise a general "suggested donation amounts" list.
  const amountParam = Number(searchParams.get('amount'));
  const isPresetAmount = donationAmounts.includes(amountParam);

  const [selectedCategory, setSelectedCategory] = useState(initialPurpose);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    amountParam > 0 && isPresetAmount ? amountParam : 50
  );
  const [customAmount, setCustomAmount] = useState(
    amountParam > 0 && !isPresetAmount ? String(amountParam) : ''
  );
  // One-time vs monthly recurring. Kept separate from selectedAmount so
  // switching frequency doesn't wipe out whatever amount the donor already
  // picked (a preset $50 stays $50, just relabeled "/mo").
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  // Second-lowest preset as the suggested recurring amount (mirrors how
  // most giving platforms nudge toward a moderate, sustainable monthly
  // gift rather than the smallest or largest option) — an honest "we
  // suggest this" nudge, not a fabricated "X% of donors pick this" claim.
  const suggestedMonthly = donationAmounts[1] ?? donationAmounts[0];

  const handleDonate = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount < 1) {
      alert('Please select or enter a valid donation amount.');
      return;
    }
    const cadence = frequency === 'monthly' ? `$${amount}/month (recurring)` : `$${amount} one-time`;
    // In production: one-time → Cloudflare Worker → Stripe Checkout;
    // monthly → Stripe Billing subscription (recurring charges need a
    // Subscription object, not a one-off Checkout session).
    alert(`Thank you! Redirecting to secure payment for ${cadence} toward "${donationCategories.find(c => c.id === selectedCategory)?.label}".\n\n(Stripe will be connected in Phase 1F)`);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-saffron to-saffron-dark text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Community</h1>
          <p className="text-amber-100 text-lg max-w-2xl mx-auto">
            Your generosity keeps our cultural programs, Nepali School, and community events going strong.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <SectionHeader title="Make a Donation or Payment" subtitle="Choose your purpose and amount." />

          {/* Category */}
          <div className="mb-8">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">
              Select payment/donation purpose
            </label>
            <select
              id="category"
              name="category"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-saffron transition-colors bg-white"
            >
              {donationCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <fieldset className="mb-8">
            <legend className="text-sm font-semibold text-gray-700 mb-3">Frequency</legend>
            <div className="grid grid-cols-2 gap-2.5">
              {(['once', 'monthly'] as const).map(freq => (
                <label key={freq} className="cursor-pointer">
                  <input
                    type="radio"
                    name="frequency"
                    checked={frequency === freq}
                    onChange={() => setFrequency(freq)}
                    className="sr-only"
                  />
                  <div
                    className={`py-3 rounded-lg border-2 text-sm font-bold text-center transition-all ${
                      frequency === freq
                        ? 'border-saffron bg-saffron text-white shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {freq === 'once' ? 'One-Time' : 'Monthly'}
                  </div>
                </label>
              ))}
            </div>
            {frequency === 'monthly' && (
              <p className="text-xs text-saffron font-medium text-center mt-2">
                A recurring gift helps us plan ahead — cancel anytime.
              </p>
            )}
          </fieldset>

          {/* Amount */}
          <fieldset className="mb-8">
            <legend className="text-sm font-semibold text-gray-700 mb-3">
              {frequency === 'monthly' ? 'Monthly Amount' : 'Donation Amount'}
            </legend>
            <div className="grid grid-cols-4 gap-2.5 mb-3">
              {donationAmounts.map(amount => (
                <label key={amount} className="relative cursor-pointer">
                  {frequency === 'monthly' && amount === suggestedMonthly && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-marigold text-ink text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full shadow-sm">
                      Suggested
                    </span>
                  )}
                  <input
                    type="radio"
                    name="amount"
                    checked={selectedAmount === amount && !customAmount}
                    onChange={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                    className="sr-only"
                  />
                  <div
                    className={`py-3 rounded-lg border-2 text-sm font-bold text-center transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'border-saffron bg-amber-50 text-saffron'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    ${amount}{frequency === 'monthly' && <span className="font-normal">/mo</span>}
                  </div>
                </label>
              ))}
            </div>
            <div>
              <label htmlFor="custom-amount" className="text-sm text-gray-500 font-medium">
                Other Amount
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                <input
                  id="custom-amount"
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron transition-colors"
                />
              </div>
            </div>
          </fieldset>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Donating to</p>
              <p className="font-semibold text-gray-900">{donationCategories.find(c => c.id === selectedCategory)?.label}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{frequency === 'monthly' ? 'Monthly Amount' : 'Amount'}</p>
              <p className="font-bold text-xl text-saffron">
                ${customAmount || selectedAmount || '—'}{frequency === 'monthly' && (customAmount || selectedAmount) && <span className="text-sm font-semibold">/mo</span>}
              </p>
            </div>
          </div>

          <button
            onClick={handleDonate}
            className="w-full py-4 bg-indigo hover:bg-indigo/85 text-white font-bold text-base rounded-full transition-colors shadow-md hover:shadow-lg"
          >
            {frequency === 'monthly' ? 'Start Monthly Giving' : 'Submit'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Secured by Stripe. We never store your card information.
          </p>
        </div>

        {/* Other ways */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Other Ways to Support</h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-800 text-sm">Mail a Check</p>
              <p className="text-xs text-gray-500">Payable to: Marietta Nepali Samaj</p>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">Volunteer</p>
              <p className="text-xs text-gray-500">Give your time and talents to our events and programs.</p>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">Spread the Word</p>
              <p className="text-xs text-gray-500">Share our events and mission with your network.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
