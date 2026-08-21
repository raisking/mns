import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router doesn't reset scroll position on navigation. Without this,
 * clicking a nav link while scrolled down on another page lands you on the
 * new route still scrolled partway down — it looks like navigation failed.
 *
 * Route+hash links (e.g. /about#mission, /nepali-school#fees) need to land
 * on that section instead — without this branch, this same effect would
 * immediately override the browser's own hash scroll by forcing (0, 0)
 * right after, making every hash link look like it silently did nothing.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
