import { useCallback, useEffect, useRef, useState } from 'react';

interface Slide {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  slides: Slide[];
  /** Applied to the root element — expected to set a width/height, since
   *  slides are absolutely positioned and don't establish their own. */
  className?: string;
  intervalMs?: number;
  label?: string;
}

export default function ImageCarousel({ slides, className = '', intervalMs = 5000, label = 'Photos' }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const goTo = useCallback((i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance pauses on hover/focus and is skipped entirely for
  // prefers-reduced-motion, per auto-rotation-controls accessibility
  // guidance — moving content needs a way to stop, and reduced-motion
  // users shouldn't get it running at all.
  useEffect(() => {
    if (paused || reducedMotionRef.current || slides.length <= 1) return;
    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), intervalMs);
    return () => clearInterval(id);
  }, [paused, slides.length, intervalMs]);

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          loading={i === 0 ? 'eager' : 'lazy'}
          aria-hidden={i !== index}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-ink/40 hover:bg-ink/60 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-ink/40 hover:bg-ink/60 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Top-right, mirroring a top-left badge some callers overlay —
              kept clear of the bottom caption card other callers add. */}
          <div className="absolute top-4 right-4 z-10 flex gap-1.5" role="tablist" aria-label={`Choose photo, ${slides.length} total`}>
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Photo ${i + 1} of ${slides.length}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
