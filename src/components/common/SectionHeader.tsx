interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = true, light = false }: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
      <h2 className={`text-3xl md:text-4xl ${light ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-lg max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-white/80' : 'text-ink-soft'}`}>
          {subtitle}
        </p>
      )}
      {/* Two-tone rule — the flag's crimson field and indigo border, side by side */}
      <div className={`mt-4 flex h-1 w-16 overflow-hidden rounded-full ${centered ? 'mx-auto' : ''}`}>
        <span className="w-2/3 bg-crimson" />
        <span className="w-1/3 bg-indigo" />
      </div>
    </div>
  );
}
