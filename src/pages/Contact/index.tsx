import { organization, socialLinks } from '../../config/organization';
import PageHero from '../../components/common/PageHero';
import ContactForm from '../../components/contact/ContactForm';

export default function Contact() {
  return (
    <>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you. Reach out with questions, ideas, or to get involved." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>

          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-saffron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-600 text-sm">{organization.address}</p>
                </div>
              </div>

              {organization.email && (
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-saffron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href={`mailto:${organization.email}`} className="text-saffron hover:underline text-sm">{organization.email}</a>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl" role="img" aria-label="Connect">🌐</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Follow Us</p>
                  <div className="flex gap-3">
                    {socialLinks.facebook && (
                      <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-saffron hover:underline font-medium">Facebook</a>
                    )}
                    {socialLinks.youtube && (
                      <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-sm text-saffron hover:underline font-medium">YouTube</a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Map — no-API-key embed via output=embed; requires no billing
                setup, unlike the JS Maps Embed API. */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden h-64">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(organization.address)}&output=embed`}
                title={`Map showing ${organization.name}'s location`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(organization.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-saffron hover:underline mt-2 inline-block"
            >
              View on Google Maps →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
