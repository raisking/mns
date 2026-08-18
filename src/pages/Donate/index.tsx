import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { donationCategories, donationAmounts } from '../../config/organization';
import SectionHeader from '../../components/common/SectionHeader';

export default function Donate() {
  const [searchParams] = useSearchParams();
  const initialPurpose = searchParams.get('purpose') || 'general';

  const [selectedCategory, setSelectedCategory] = useState(initialPurpose);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');

  const handleDonate = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount < 1) {
      alert('Please select or enter a valid donation amount.');
      return;
    }
    // In production: call Cloudflare Worker → Stripe Checkout
    alert(`Thank you! Redirecting to secure payment for $${amount} toward "${donationCategories.find(c => c.id === selectedCategory)?.label}".\n\n(Stripe Checkout will be connected in Phase 1F)`);
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
          <SectionHeader title="Make a Donation" subtitle="Choose your purpose and amount." />

          {/* Category */}
          <fieldset className="mb-8">
            <legend className="text-sm font-semibold text-gray-700 mb-3">Donation Purpose</legend>
            <div className="grid grid-cols-2 gap-2.5">
              {donationCategories.map(cat => (
                <label key={cat.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                    className="sr-only"
                  />
                  <div
                    className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium text-center transition-all ${
                      selectedCategory === cat.id
                        ? 'border-saffron bg-amber-50 text-saffron'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {cat.label}
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Amount */}
          <fieldset className="mb-8">
            <legend className="text-sm font-semibold text-gray-700 mb-3">Donation Amount</legend>
            <div className="grid grid-cols-4 gap-2.5 mb-3">
              {donationAmounts.map(amount => (
                <label key={amount} className="cursor-pointer">
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
                    ${amount}
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
              <p className="text-xs text-gray-500">Amount</p>
              <p className="font-bold text-xl text-saffron">
                ${customAmount || selectedAmount || '—'}
              </p>
            </div>
          </div>

          <button
            onClick={handleDonate}
            className="w-full py-4 bg-indigo hover:bg-indigo-dark text-white font-bold text-base rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Donate Now →
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
