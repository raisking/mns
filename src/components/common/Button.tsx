import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
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
// Crimson (the flag's field) stays the accent throughout the rest of the
// site — headings, the emblem, section markers — so the flag identity isn't
// lost, it's just no longer doing double duty as "the button color".
const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo hover:bg-indigo-dark text-white shadow-sm',
  secondary: 'bg-crimson hover:bg-crimson-dark text-white shadow-sm',
  accent: 'bg-marigold hover:bg-marigold-light text-ink shadow-sm',
  outline: 'border-2 border-indigo text-indigo hover:bg-indigo hover:text-white',
  ghost: 'text-indigo hover:bg-indigo/10',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

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
  const base = `inline-flex items-center justify-center font-body font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  if (to) return <Link to={to} className={base} onClick={onClick}>{children}</Link>;
  if (href) return <a href={href} className={base} target="_blank" rel="noopener noreferrer" onClick={onClick}>{children}</a>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}
