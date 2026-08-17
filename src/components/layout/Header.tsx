import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo-nepali.png';
import prayerFlags from '../../assets/buddhist-flag.png';

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
    ],
  },
  {
    label: 'Leadership',
    children: [
      { label: 'President', to: '/leadership/president' },
      { label: 'Executive Committee', to: '/leadership' },
      { label: 'Past Presidents', to: '/leadership/past-presidents' },
    ],
  },
  { label: 'Nepali School', to: '/nepali-school' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
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
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
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
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0" onClick={() => { closeMobile(); goHome(); }}>
            <img src={logo} alt="Marietta Nepali Samaj" className="h-12 md:h-16 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
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
                      openDropdown === item.label || item.children.some(c => c.to === location.pathname)
                        ? 'text-crimson border-crimson'
                        : 'text-gray-700 border-transparent hover:text-crimson hover:border-crimson/30'
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
                        <span className="w-2/3 bg-crimson" />
                        <span className="w-1/3 bg-indigo" />
                      </div>
                      <div className="py-1.5">
                        {item.children.map(child => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className={({ isActive }) =>
                              `group flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                                isActive ? 'text-crimson bg-crimson/5 font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-crimson'
                              }`
                            }
                            onClick={() => setOpenDropdown(null)}
                          >
                            {({ isActive }) => (
                              <>
                                <span className={`w-1 h-1 rounded-full flex-shrink-0 transition-colors ${isActive ? 'bg-crimson' : 'bg-gray-300 group-hover:bg-crimson'}`} aria-hidden="true" />
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
                      isActive ? 'text-crimson font-semibold border-crimson' : 'text-gray-700 border-transparent hover:text-crimson hover:border-crimson/30'
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
            <Link
              to="/donate"
              className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo hover:bg-indigo-dark rounded-lg transition-colors shadow-sm"
            >
              Donate
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-crimson hover:bg-gray-100 transition-colors"
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
      {/* Prayer flag border — tiled rather than stretched, since the source
          photo is fixed-resolution and would blur if stretched full-width. */}
      <div
        className="h-8 md:h-10"
        style={{
          backgroundImage: `url(${prayerFlags})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'left center',
        }}
        role="presentation"
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg" role="navigation" aria-label="Mobile navigation">
          <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
            {navItems.map(item =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      openDropdown === item.label || item.children.some(c => c.to === location.pathname)
                        ? 'text-crimson bg-crimson/5'
                        : 'text-gray-700 hover:text-crimson hover:bg-gray-50'
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
                      <div className="ml-4 mt-1 mb-1 space-y-0.5 border-l-2 border-crimson/20 pl-4">
                        {item.children.map(child => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className={({ isActive }) =>
                              `block px-3 py-2 text-sm rounded-md transition-colors ${
                                isActive ? 'text-crimson font-medium bg-crimson/5' : 'text-gray-600 hover:text-crimson hover:bg-gray-50'
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
                      isActive ? 'text-crimson font-semibold bg-crimson/5' : 'text-gray-700 hover:text-crimson hover:bg-gray-50'
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
                className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo hover:bg-indigo-dark rounded-lg transition-colors"
                onClick={closeMobile}
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
