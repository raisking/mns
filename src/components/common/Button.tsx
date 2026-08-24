import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'accent' | 'trust' | 'light' | 'outline' | 'outlineLight' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

// Indigo (the flag's border color) carries the primary action — red reads as
// "stop/danger" in UI convention, which fights a Donate/Submit/Contact button.
// Warm saffron (sindoor/tika powder, not the flag's literal crimson field)
// stays the accent throughout the rest of the site — headings, section
// markers — so the Nepali cultural grounding isn't lost, it's just warmer
// than the flag-red original and no longer doubles as "the button color".
const variantClasses: Record<Variant, string> = {
  // Hover lightens (opacity-lowered toward the page background) rather
  // than darkens — no more hover:-translate-y lift either, just the color.
  primary: 'bg-indigo hover:bg-indigo/85 text-white shadow-sm',
  secondary: 'bg-saffron hover:bg-saffron/85 text-white shadow-sm',
  accent: 'bg-marigold hover:bg-marigold-light text-ink shadow-sm',
  // New "trust" anchor (see index.css) — for institutional-credibility
  // moments specifically, not a general-purpose swap for `primary`. Reach
  // for this on About/Leadership/Donate-style CTAs; leave school/festival
  // CTAs on saffron/marigold, where they already read warm and welcoming.
  trust: 'bg-himal hover:bg-himal-dark text-white shadow-sm',
  // Solid white — for a high-contrast button ON a saturated color
  // background (e.g. a saffron CTA banner). Don't try to get this look by
  // overriding primary/secondary/accent's className instead: those set
  // their own bg-*/text-* utilities, and Tailwind's cascade order isn't
  // guaranteed to favor a later className override for the same property.
  light: 'bg-white hover:bg-paper-deep text-saffron shadow-sm',
  outline: 'border-2 border-indigo text-indigo hover:bg-indigo hover:text-white',
  // White-bordered outline for use ON a saturated/dark background (hero,
  // CTA gradients) — inverts to solid white + ink text on hover. This
  // used to be `variant="outline"` with a className override
  // (`border-white text-white hover:bg-white hover:text-{saffron,ink,indigo}`)
  // at six different call sites, which hit the exact cascade-order bug this
  // file already warns about: outline's own `hover:text-white` competes
  // with the override's `hover:text-*` at equal specificity, so the winner
  // isn't guaranteed — that's what made the text disappear on hover (white
  // fill + white text both won independently). A real variant sidesteps the
  // conflict entirely instead of layering another override on top of it.
  outlineLight: 'border-2 border-white text-white hover:bg-white hover:text-ink',
  ghost: 'text-indigo hover:bg-indigo/10',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

// Fully-rounded pill + bold weight (not the earlier rounded-lg/semibold) —
// same colors as always (indigo/saffron/marigold), just a bolder shape.
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  // active:scale simulates a physical press on click/tap — real feedback for
  // a real action, not decoration. Skipped when disabled (nothing to press).
  const base = `inline-flex items-center justify-center font-body font-bold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'} ${className}`;

  if (to) return <Link to={to} className={base} onClick={onClick}>{children}</Link>;
  if (href) return <a href={href} className={base} target="_blank" rel="noopener noreferrer" onClick={onClick}>{children}</a>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}
