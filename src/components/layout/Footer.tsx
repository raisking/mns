import { Link } from 'react-router-dom';
import { organization } from '../../config/organization';
import logo from '../../assets/logo-nepali.png';
import SocialIcons from '../common/SocialIcons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            {/* logo.png has an opaque light background (no alpha channel), so it
                sits on a white plate here rather than directly on the dark footer. */}
            <div className="inline-flex bg-white rounded-xl p-2 shadow-sm mb-4">
              <img src={logo} alt="Marietta Nepali Samaj" className="h-14 w-auto rounded-md" />
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
            className="text-sm font-bold text-white bg-indigo hover:bg-indigo-dark px-4 py-1.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            Donate
          </Link>
        </div>
      </div>
    </footer>
  );
}
