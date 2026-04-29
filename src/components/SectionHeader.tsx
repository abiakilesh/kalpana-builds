interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeader({ eyebrow, title, description, centered = true, light }: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center mx-auto" : ""} max-w-2xl space-y-3 mb-12`}>
      {eyebrow && (
        <div className={`inline-block text-xs font-bold tracking-[0.25em] uppercase ${light ? "text-gold" : "text-royal"}`}>
          {eyebrow}
        </div>
      )}
      <h2 className={`font-display text-3xl md:text-4xl font-bold leading-tight ${light ? "text-white" : "text-navy"}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-base md:text-lg leading-relaxed ${light ? "text-white/80" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
