import { useEffect, useRef } from 'react';
import type { Shoutout } from '../../types/Shoutout';
import Button from './Button';

interface ShoutoutModalProps {
  open: boolean;
  onClose: () => void;
  shoutouts: Shoutout[];
  month: string;
}

const categoryStyles: Record<Shoutout['category'], string> = {
  Member: 'bg-crimson/10 text-crimson',
  Student: 'bg-indigo/10 text-indigo',
  Volunteer: 'bg-marigold/25 text-ink',
};

export default function ShoutoutModal({ open, onClose, shoutouts, month }: ShoutoutModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      // Simple focus trap: wrap Tab/Shift+Tab within the dialog.
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  // Auto-dismiss after 10s if left untouched — a fresh 10s window each
  // time it opens, cleared as soon as it's closed by any other means.
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, 10_000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shoutout-modal-title"
        className="animate-modal-in relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Two-tone accent bar — the same crimson/indigo signature used
            throughout the site's section headers. */}
        <div className="h-1.5 flex sticky top-0" aria-hidden="true">
          <span className="w-2/3 bg-crimson" />
          <span className="w-1/3 bg-indigo" />
        </div>

        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-ink transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <span className="text-4xl mb-3 block" role="img" aria-label="Celebration">🎉</span>
            <p className="text-sm font-semibold text-crimson uppercase tracking-wider mb-2">{month} · शाबास</p>
            <h2 id="shoutout-modal-title" className="text-2xl sm:text-3xl text-ink">
              Community Shoutouts
            </h2>
            <p className="text-ink-soft text-sm mt-2">
              Recognizing outstanding work from our community this month.
            </p>
          </div>

          <div className="space-y-4">
            {shoutouts.map(person => (
              <div key={person.id} className="flex gap-4 bg-paper-deep rounded-xl p-4">
                <img
                  src={person.photo}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-white"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-ink">{person.name}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${categoryStyles[person.category]}`}>
                      {person.category} of the Month
                    </span>
                  </div>
                  <p className="text-sm text-ink-soft leading-relaxed">{person.highlight}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-ink-soft mb-4">
              Know someone who deserves a shoutout next month?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button to="/contact" variant="primary" onClick={onClose}>Nominate Someone</Button>
              <Button variant="ghost" onClick={onClose}>Maybe Later</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
