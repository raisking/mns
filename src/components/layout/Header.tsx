import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { organization } from '../../config/organization';

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

  const toggleDropdown = (label: string) => {
    setOpenDropdown(prev => (prev === label ? null : label));
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" onClick={closeMobile}>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#C41E3A] flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-sm flex-shrink-0">
              MNS
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="font-bold text-gray-900 text-base md:text-lg leading-none">{organization.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">Marietta, Georgia</p>
            </div>
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
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#C41E3A] rounded-md transition-colors"
                    onClick={() => toggleDropdown(item.label)}
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    // pt-1 (not mt-1) keeps the gap above the panel inside this
                    // wrapper's hoverable box, so mousing down from the trigger
                    // into the panel doesn't cross a dead zone and trigger
                    // onMouseLeave prematurely.
                    <div className="absolute left-0 top-full pt-1 w-52 z-50">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                        {item.children.map(child => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-sm transition-colors ${
                                isActive ? 'text-[#C41E3A] bg-red-50 font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-[#C41E3A]'
                              }`
                            }
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive ? 'text-[#C41E3A] font-semibold' : 'text-gray-700 hover:text-[#C41E3A]'
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
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#C41E3A] hover:bg-[#a01830] rounded-lg transition-colors shadow-sm"
            >
              Donate
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[#C41E3A] hover:bg-gray-100 transition-colors"
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg" role="navigation" aria-label="Mobile navigation">
          <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
            {navItems.map(item =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#C41E3A] rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDropdown(item.label)}
                    aria-expanded={openDropdown === item.label}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#C41E3A] pl-4">
                      {item.children.map(child => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-sm rounded-md transition-colors ${
                              isActive ? 'text-[#C41E3A] font-medium bg-red-50' : 'text-gray-600 hover:text-[#C41E3A] hover:bg-gray-50'
                            }`
                          }
                          onClick={closeMobile}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive ? 'text-[#C41E3A] font-semibold bg-red-50' : 'text-gray-700 hover:text-[#C41E3A] hover:bg-gray-50'
                    }`
                  }
                  onClick={closeMobile}
                >
                  {item.label}
                </NavLink>
              )
            )}
            <div className="pt-3 border-t border-gray-100">
              <Link
                to="/donate"
                className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-[#C41E3A] hover:bg-[#a01830] rounded-lg transition-colors"
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
