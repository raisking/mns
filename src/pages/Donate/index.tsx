import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { donationCategories } from '../../config/organization';
import SectionHeader from '../../components/common/SectionHeader';
import zelleQrImg from '../../assets/qr-zelle.png';
import { usePageMeta } from '../../hooks/usePageMeta';

// Zelle is the org's only payment/donation method for now — no Stripe (or
// any other processor) is connected. Previously this page had a full
// category/frequency/amount picker ending in a "Submit" button that just
// alerted "Stripe will be connected in Phase 1F"; removed rather than left
// pointing at a payment flow that doesn't exist. Other pages still deep-link
// here with `?purpose=` and `?amount=` (School's "Enroll & Pay", Home and
// School's "Support the School", Membership's tier picker) — those are
// preserved as read-only context shown above the QR code instead of feeding
// a live form.
export default function Donate() {
  const [searchParams] = useSearchParams();
  const purposeLabel = donationCategories.find(c => c.id === searchParams.get('purpose'))?.label;
  const amountParam = searchParams.get('amount');
  const [qrZoomOpen, setQrZoomOpen] = useState(false);

  usePageMeta({
    title: 'Donate',
    description: "Support Marietta Nepali Samaj's cultural programs and Nepali School via Zelle.",
    path: '/donate',
  });

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
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
          <SectionHeader
            title="Donate via Zelle"
            subtitle="We accept payments and donations through Zelle — no fees, nothing to sign up for."
          />

          {(purposeLabel || amountParam) && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-center gap-8 text-left">
              {purposeLabel && (
                <div>
                  <p className="text-xs text-gray-500">Purpose</p>
                  <p className="font-semibold text-gray-900">{purposeLabel}</p>
                </div>
              )}
              {amountParam && (
                <div>
                  <p className="text-xs text-gray-500">Suggested Amount</p>
                  <p className="font-bold text-xl text-saffron">${amountParam}</p>
                </div>
              )}
            </div>
          )}

          {/* Click to zoom — same lightbox pattern as an event poster
              (EventDetail.tsx): a QR code this small is hard to scan
              straight off a laptop screen, so let it open full-size. */}
          <button
            type="button"
            onClick={() => setQrZoomOpen(true)}
            className="group relative block w-56 mx-auto rounded-xl border border-gray-200 shadow-sm overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            aria-label="View Zelle QR code full size"
          >
            <img src={zelleQrImg} alt="Zelle QR code for Nepali Samaj Marietta Inc." className="w-full" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </button>

          {/* A real download of a real file on a real page — not an
              Artifact preview, so a plain download link works fine. */}
          <a
            href={zelleQrImg}
            download="mns-zelle-qr.png"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron hover:underline mt-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download QR Code
          </a>

          <p className="text-sm text-gray-600 max-w-sm mx-auto mt-5">
            Open Zelle in your banking app and scan (or upload the downloaded code) to send
            {amountParam ? ` your $${amountParam} payment` : ' your payment'} directly to <strong>Nepali Samaj Marietta Inc.</strong>
            {purposeLabel && ` Please include "${purposeLabel}" in the memo so we know what it's for.`}
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

      {/* QR zoom lightbox — same structure as EventDetail's poster viewer. */}
      {qrZoomOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setQrZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zelle QR code, full size"
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            onClick={() => setQrZoomOpen(false)}
            aria-label="Close QR code viewer"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={zelleQrImg}
            alt="Zelle QR code for Nepali Samaj Marietta Inc."
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl bg-white p-4"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
