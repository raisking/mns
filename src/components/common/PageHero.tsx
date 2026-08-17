interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Optional background photo, dimmed behind the ink overlay. */
  image?: string;
}

export default function PageHero({ eyebrow, title, subtitle, image }: PageHeroProps) {
  return (
    <div className="relative bg-ink text-white py-16 md:py-24 overflow-hidden">
      {image && (
        <img src={image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      )}
      {/* Quiet radial glow of the flag's crimson, grounding the ink background */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 20% 15%, rgba(200,16,46,0.35), transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {eyebrow && (
          <p className="text-marigold text-sm font-semibold uppercase tracking-wider mb-3">{eyebrow}</p>
        )}
        <h1 className="text-4xl md:text-5xl mb-4">{title}</h1>
        {subtitle && (
          <p className="text-white/75 text-lg max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
      <div className="dhaka-strip absolute bottom-0 left-0 right-0" aria-hidden="true" />
    </div>
  );
}
