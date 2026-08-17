interface EmblemProps {
  className?: string;
}

/**
 * The site's mark: a folded corner in the flag's two colors — crimson field,
 * indigo border — with a small marigold sun. A quiet nod to the twin-pennant
 * shape of Nepal's flag, sized to sit in a normal square badge slot.
 */
export default function Emblem({ className = 'w-10 h-10' }: EmblemProps) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-sm flex-shrink-0 ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0 bg-crimson"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 78%, 85% 100%, 0 100%)' }}
      />
      <div
        className="absolute inset-0 bg-indigo"
        style={{ clipPath: 'polygon(100% 78%, 100% 100%, 85% 100%)' }}
      />
      <div className="absolute top-[22%] left-[20%] w-[16%] h-[16%] rounded-full bg-marigold" />
    </div>
  );
}
