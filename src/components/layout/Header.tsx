import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/mns_f.png';

interface NavItem {
  label: string;
  to?: string;
  children?: { label: string; to: string }[];
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'About',
    children: [
      { label: 'About Us', to: '/about' },
      { label: 'Mission & Vision', to: '/about#mission' },
      { label: 'Objectives', to: '/objectives' },
      { label: 'History', to: '/about#history' },
      { label: 'Bylaws', to: '/bylaws' },
    ],
  },
  {
    label: 'Leadership',
    children: [
      { label: 'President', to: '/leadership/president' },
      { label: 'Executive Committee', to: '/leadership' },
      { label: 'Past Presidents', to: '/leadership/past-presidents' },
      { label: 'Committee Archive', to: '/leadership/committee-archive' },
    ],
  },
  {
    label: 'Nepali School',
    children: [
      { label: 'School Overview', to: '/nepali-school' },
      { label: 'Meet Our Team', to: '/nepali-school/team' },
    ],
  },
  // Events + Gallery merged into one dropdown (event photos are naturally
  // part of "Events"), and Get Involved absorbed Contact (asking to get
  // involved and reaching out are the same intent) — brings 8 top-level
  // items down to 6 without losing any destination, just nesting two of
  // them one click deeper.
  //
  // This dropdown used to also pin a flagship "Dashain 2026" link straight
  // at its event-detail page — removed along with the Dashain and Nepali
  // New Year events themselves (see mockData.ts) since that route no
  // longer exists. Re-add a pinned link here if a new flagship event needs
  // the same promoted nav slot later.
  {
    label: 'Events',
    children: [
      { label: 'Upcoming Events', to: '/events' },
      { label: 'Photo Gallery', to: '/gallery' },
    ],
  },
  {
    label: 'Get Involved',
    children: [
      { label: 'Volunteer', to: '/volunteer' },
      { label: 'Membership', to: '/membership' },
      { label: 'Sponsorship', to: '/sponsorship' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
];

// Exact-match (`c.to === pathname`) misses detail routes that hang off a
// dropdown child, e.g. /events/:slug or /gallery/:slug under the "Events"
// child links — the parent button wouldn't highlight while reading an
// event or viewing an album. Treat any path that starts with a child's
// `to` (at a segment boundary) as still "inside" that child.
const isChildActive = (childTo: string, pathname: string) =>
  pathname === childTo || pathname.startsWith(`${childTo}/`);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Covers the whole header — desktop nav AND the mobile menu — not just
  // the desktop <nav>. openDropdown is shared between both, so scoping
  // this to only the desktop nav made every tap inside the mobile menu
  // register as "outside" (the desktop nav is hidden/empty on mobile),
  // racing the submenu button's own click handler and breaking it.
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const toggleDropdown = (label: string) => {
    setOpenDropdown(prev => (prev === label ? null : label));
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  // Clicking Home/the logo while already on "/" doesn't trigger a route
  // change, so the app-level scroll-to-top on navigation never fires.
  // Scroll explicitly here so it always lands back at the top of the hero.
  const goHome = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Close the open desktop dropdown on outside click or Escape, so it
  // doesn't depend solely on hover (which clicking/touch can't trigger).
  useEffect(() => {
    if (!openDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openDropdown]);

  return (
    <header ref={headerRef} className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0" onClick={() => { closeMobile(); goHome(); }}>
            {/* mns_f.png is a wide horizontal lockup (icon + wordmark,
                ~3:1 aspect), not the old square emblem — sized shorter so
                it doesn't overrun the nav next to it. */}
            <img src={logo} alt="Marietta Nepali Samaj" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 font-nav" aria-label="Main navigation">
            {navItems.map(item =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                      openDropdown === item.label || item.children.some(c => isChildActive(c.to, location.pathname))
                        ? 'text-saffron border-saffron'
                        : 'text-gray-700 border-transparent hover:text-saffron hover:border-saffron/30'
                    }`}
                    onClick={() => toggleDropdown(item.label)}
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Always mounted (visibility/opacity toggled) so the panel can
                      fade+slide in rather than snapping into view. pt-2 (not
                      mt-2) keeps that gap inside this wrapper's hoverable box,
                      so mousing down from the trigger doesn't cross a dead zone
                      and trigger onMouseLeave prematurely. */}
                  <div
                    className={`absolute left-0 top-full pt-2 w-56 z-50 transition-all duration-150 ${
                      openDropdown === item.label
                        ? 'opacity-100 translate-y-0 visible'
                        : 'opacity-0 -translate-y-1 invisible pointer-events-none'
                    }`}
                  >
                    <div className="bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden">
                      <div className="h-0.5 flex" aria-hidden="true">
                        <span className="w-2/3 bg-saffron" />
                        <span className="w-1/3 bg-indigo" />
                      </div>
                      <div className="py-1.5">
                        {item.children.map(child => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className={({ isActive }) =>
                              `group flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                                isActive ? 'text-saffron bg-saffron/5 font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-saffron'
                              }`
                            }
                            onClick={() => setOpenDropdown(null)}
                          >
                            {({ isActive }) => (
                              <>
                                <span className={`w-1 h-1 rounded-full flex-shrink-0 transition-colors ${isActive ? 'bg-saffron' : 'bg-gray-300 group-hover:bg-saffron'}`} aria-hidden="true" />
                                {child.label}
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  end={item.to === '/'}
                  onClick={item.to === '/' ? goHome : undefined}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                      isActive ? 'text-saffron font-semibold border-saffron' : 'text-gray-700 border-transparent hover:text-saffron hover:border-saffron/30'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Donate button + hamburger */}
          <div className="flex items-center gap-3">
            {/* Marigold "pill + pin" treatment, styled after cmn.org's
                header Donate button — bright/celebratory rather than the
                site's usual indigo primary-action color, so it reads as
                the one CTA on the page that's different from every other
                button. The pin is decorative (aria-hidden) — MNS is a
                single-location org, so unlike cmn.org's version it isn't
                a hospital-locator trigger, just the same visual mark. */}
            <Link
              to="/donate"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-ink bg-marigold hover:bg-marigold-light rounded-full transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Donate
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-saffron hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Two-tone accent hairline, in place of a plain gray border. Uses
          the new himal "trust" blue as its second color instead of the
          dropdown panels'/ShoutoutModal's indigo — this is the one spot
          on every page where that trust anchor shows up site-wide, without
          touching the shared saffron/indigo motif those other components
          still use. */}
      <div className="h-0.5 flex" aria-hidden="true">
        <span className="w-2/3 bg-saffron" />
        <span className="w-1/3 bg-himal" />
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-ink-soft/10 shadow-lg font-nav" role="navigation" aria-label="Mobile navigation">
          <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
            {navItems.map(item =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      openDropdown === item.label || item.children.some(c => isChildActive(c.to, location.pathname))
                        ? 'text-saffron bg-saffron/5'
                        : 'text-gray-700 hover:text-saffron hover:bg-gray-50'
                    }`}
                    onClick={() => toggleDropdown(item.label)}
                    aria-expanded={openDropdown === item.label}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* grid-rows 0fr/1fr trick — animates height without a
                      measured pixel value, and collapses cleanly to 0. */}
                  <div className={`grid transition-all duration-200 ${openDropdown === item.label ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="ml-4 mt-1 mb-1 space-y-0.5 border-l-2 border-saffron/20 pl-4">
                        {item.children.map(child => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className={({ isActive }) =>
                              `block px-3 py-2 text-sm rounded-md transition-colors ${
                                isActive ? 'text-saffron font-medium bg-saffron/5' : 'text-gray-600 hover:text-saffron hover:bg-gray-50'
                              }`
                            }
                            onClick={closeMobile}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive ? 'text-saffron font-semibold bg-saffron/5' : 'text-gray-700 hover:text-saffron hover:bg-gray-50'
                    }`
                  }
                  onClick={() => { closeMobile(); if (item.to === '/') goHome(); }}
                >
                  {item.label}
                </NavLink>
              )
            )}
            <div className="pt-3 border-t border-gray-100">
              <Link
                to="/donate"
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-ink bg-marigold hover:bg-marigold-light rounded-full transition-colors"
                onClick={closeMobile}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Donate
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
