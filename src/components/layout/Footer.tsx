import { Link } from 'react-router-dom';
import { organization } from '../../config/organization';
import logo from '../../assets/mns_f.png';
import SocialIcons from '../common/SocialIcons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/70 border-t-2 border-himal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            {/* mns_f.png ships on an opaque white background, and its wordmark
                text is near-black — same contrast problem against bg-ink
                either way. The white plate still does the job, now simply
                by matching the image's own background instead of adding
                one. */}
            <div className="inline-block bg-white rounded-lg p-3 mb-4">
              <img src={logo} alt="Marietta Nepali Samaj" className="h-12 w-auto" />
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Connecting the Nepali community in Marietta, Georgia. Preserving our culture, celebrating our heritage.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <SocialIcons variant="dark" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Leadership', to: '/leadership' },
                { label: 'Nepali School', to: '/nepali-school' },
                { label: 'Events', to: '/events' },
                { label: 'Gallery', to: '/gallery' },
                { label: 'Bylaws', to: '/bylaws' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-4">Get Involved</h3>
            <ul className="space-y-2">
              {[
                { label: 'Donate', to: '/donate' },
                { label: 'Volunteer', to: '/volunteer' },
                { label: 'Membership', to: '/membership' },
                { label: 'Sponsorship', to: '/sponsorship' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <svg className="w-4 h-4 mt-0.5 text-marigold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {organization.address}
              </li>
              {organization.email && (
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-marigold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${organization.email}`} className="text-white/60 hover:text-white transition-colors">
                    {organization.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/50">
            © {currentYear} {organization.name}. All rights reserved.
          </p>
          <Link
            to="/donate"
            // Marigold, matching the Header/mobile-nav Donate treatment
            // (styled after cmn.org's yellow "pill + pin" Donate button —
            // see Header.tsx). Still resolves the original white-fill
            // reasoning below: marigold (#e7a33e) is nowhere near bg-ink
            // (#241712) in hue/luminance, so it doesn't repeat the
            // near-invisible indigo-on-ink bug this used to work around.
            className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-ink bg-marigold hover:bg-marigold-light px-4 py-1.5 rounded-full transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Donate
          </Link>
        </div>
      </div>
    </footer>
  );
}
